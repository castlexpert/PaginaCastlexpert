import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { AppCopy } from '../i18n';

type AboutModalProps = {
  open: boolean;
  onClose: () => void;
  content: AppCopy['about'];
};

export default function AboutModal({ open, onClose, content }: AboutModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" onClick={onClose} aria-label={content.close} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      <div className="relative mx-auto flex h-[100dvh] max-w-3xl items-end px-3 pb-3 sm:items-center sm:px-6 sm:pb-0">
        <div role="dialog" aria-modal="true" aria-label={content.title} className="relative w-full max-h-[90dvh] overflow-hidden rounded-3xl cx-card shadow-2xl shadow-black/30">
          <div className="sticky top-0 z-10 border-b border-white/10 bg-white/10 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5">
              <h3 className="text-2xl font-black text-zinc-950 sm:text-3xl">{content.title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition hover:bg-white/20"
                aria-label={content.close}
                title={content.close}
              >
                <X className="h-6 w-6 text-zinc-900" />
              </button>
            </div>
          </div>

          <div className="space-y-5 overflow-y-auto px-5 py-6 text-base leading-relaxed text-zinc-800 sm:px-8 sm:text-lg">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:hidden"
            >
              {content.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
