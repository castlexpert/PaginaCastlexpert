import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import type { AppCopy, Language } from '../i18n';

type ChatWidgetProps = {
  content: AppCopy['chat'];
  language: Language;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatWidget({ content, language }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [conversationId] = useState(() => uid());
  const [phone, setPhone] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [handoffNotice, setHandoffNotice] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: uid(), role: 'assistant', text: content.welcome },
  ]);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
  }, [open, messages.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function send() {
    const question = input.trim();
    if (!question || loading) return;

    setHandoffNotice(null);
    setLoading(true);
    setInput('');

    const userMsg: ChatMessage = { id: uid(), role: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, language, message: question }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { answer?: string } = await res.json();
      const answer = data.answer?.trim() || '';
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text: answer || '...' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          text:
            language === 'es'
              ? 'Tuve un problema respondiendo. Intenta de nuevo en unos segundos.'
              : 'I had trouble answering. Please try again in a few seconds.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function requestAdvisor() {
    if (handoffLoading) return;
    setHandoffNotice(null);
    setHandoffLoading(true);
    try {
      const transcript = messages.map((m) => `${m.role === 'user' ? 'Cliente' : content.assistantName}: ${m.text}`).join('\n');
      const res = await fetch('/api/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, language, phone: phone.trim(), transcript }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setHandoffNotice(content.advisorSent);
    } catch {
      setHandoffNotice(content.advisorError);
    } finally {
      setHandoffLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-[80] md:bottom-6 md:right-24">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cx-card cx-card-hover flex h-14 w-14 items-center justify-center"
          aria-label={content.launcherLabel}
          title={content.launcherLabel}
        >
          <MessageCircle className="h-6 w-6 text-zinc-900" />
        </button>
      ) : (
        <div className="w-[min(92vw,420px)] overflow-hidden rounded-3xl cx-card shadow-2xl shadow-black/25">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/10 px-4 py-3 backdrop-blur-2xl">
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold tracking-tight text-zinc-950">{content.title}</div>
              <div className="truncate text-xs text-zinc-700">{content.subtitle}</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-white/20"
              aria-label={language === 'es' ? 'Cerrar' : 'Close'}
              title={language === 'es' ? 'Cerrar' : 'Close'}
            >
              <X className="h-5 w-5 text-zinc-900" />
            </button>
          </div>

          <div ref={listRef} className="max-h-[52vh] overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={[
                    'max-w-[88%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-white/10 text-zinc-900 border border-white/10',
                  ].join(' ')}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 bg-white/10 px-4 py-3 backdrop-blur-2xl">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void send();
                }}
                placeholder={content.placeholder}
                className="h-11 flex-1 rounded-2xl border border-black/10 bg-white/40 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:bg-white/55"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={!canSend}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d4d38] text-white transition hover:bg-[#0b3f2f] disabled:opacity-50"
                aria-label={loading ? content.sending : content.send}
                title={loading ? content.sending : content.send}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid gap-2">
              <label className="text-xs font-semibold text-zinc-700">{content.phoneLabel}</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={content.phonePlaceholder}
                className="h-10 rounded-2xl border border-black/10 bg-white/35 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:bg-white/50"
              />
              <button
                type="button"
                onClick={() => void requestAdvisor()}
                disabled={handoffLoading}
                className="mt-1 w-full rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white/25 disabled:opacity-50"
              >
                {content.askAdvisor}
              </button>
              {handoffNotice ? <div className="text-xs text-zinc-700">{handoffNotice}</div> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
