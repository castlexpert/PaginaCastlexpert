import { useState } from 'react';
import { Send, Mail, CheckCircle } from 'lucide-react';
import type { AppCopy } from '../i18n';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

type ContactProps = {
  content: AppCopy['contact'];
};

export default function Contact({ content }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(content.form.error);
      }
    } catch {
      setError(content.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#f7f3eb]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f3eb] via-[#f1ede4] to-[#f8f4ed]"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">{content.title}</h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 rounded-2xl bg-white/25 backdrop-blur-2xl border border-black/15">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">{content.emailLabel}</h3>
                <a href="mailto:info@castlexpertcr.com" className="text-zinc-700 hover:text-black transition-colors">
                  info@castlexpertcr.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white/25 backdrop-blur-2xl border border-black/15">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">{content.whatsappLabel}</h3>
                <a href="https://wa.me/50688888888" target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-black transition-colors">
                  +506 8888-8888
                </a>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 rounded-3xl bg-white/25 backdrop-blur-2xl border border-black/15 shadow-xl shadow-black/5">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                {content.form.name}
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-black/15 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black/40 focus:border-transparent transition-all"
                placeholder={content.form.namePlaceholder}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                {content.form.email}
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-black/15 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black/40 focus:border-transparent transition-all"
                placeholder={content.form.emailPlaceholder}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
                {content.form.message}
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-black/15 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black/40 focus:border-transparent transition-all resize-none"
                placeholder={content.form.messagePlaceholder}
              />
            </div>

            {error && <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-700">{error}</div>}

            {success && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {content.form.success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-black rounded-lg font-semibold text-white hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {content.form.sending}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {content.form.submit}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
