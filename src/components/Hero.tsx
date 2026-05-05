import {
  ArrowRight,
  CheckCircle,
  Facebook,
  Instagram,
  Menu,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AppCopy } from '../i18n';

type HeroProps = {
  content: AppCopy['hero'];
  onToggleLanguage: () => void;
};

export default function Hero({ content, onToggleLanguage }: HeroProps) {
  const [mobileDockOpen, setMobileDockOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileDockOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4 px-2">
          <div className="text-4xl italic tracking-tight text-zinc-900 font-display">CastleXpert</div>

          <div className="flex items-center gap-4 rounded-full border border-black/10 bg-white/30 px-4 py-2 backdrop-blur-2xl">
            <div className="flex items-center gap-2 text-sm text-zinc-700">
              <span className="h-2 w-2 rounded-full bg-[#25D366]"></span>
              {content.availability}
            </div>
            <div className="h-4 w-px bg-black/10"></div>
            <button
              type="button"
              onClick={onToggleLanguage}
              className="rounded-full border border-black/10 bg-white/35 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-zinc-800 transition hover:bg-white/50"
            >
              {content.languageButton}
            </button>
            <div className="h-4 w-px bg-black/10"></div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/castlexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/10 bg-white/25 p-1.5 text-zinc-700 hover:text-black transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/castlexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/10 bg-white/25 p-1.5 text-zinc-700 hover:text-black transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </header>

        <div className="relative overflow-hidden rounded-[2.2rem] border border-black/10 bg-white/20 p-6 backdrop-blur-2xl shadow-[0_20px_90px_-45px_rgba(0,0,0,0.35)] md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_26%,rgba(255,255,255,0.72),transparent_55%),radial-gradient(circle_at_86%_80%,rgba(206,198,183,0.35),transparent_45%)]"></div>

          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/30 px-4 py-2 text-xs uppercase tracking-[0.14em] text-zinc-700 backdrop-blur-2xl">
                <CheckCircle className="h-4 w-4" />
                {content.badge}
              </div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/30 px-4 py-2 text-xs uppercase tracking-[0.14em] text-zinc-700 backdrop-blur-2xl">
                <CheckCircle className="h-4 w-4" />
                {content.architectureBadge}
              </div>

              <h1 className="font-display text-5xl leading-[1.02] text-zinc-950 sm:text-6xl lg:text-7xl">
                {content.title}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-700">{content.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#0d4d38] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#0d4d38]/30 transition hover:bg-[#0b3f2f]"
                >
                  {content.primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="rounded-xl border border-black/10 bg-[#e6ead7] px-6 py-3.5 font-semibold text-zinc-900 transition hover:bg-[#dbe1c8]"
                >
                  {content.secondaryCta}
                </button>
                <button
                  onClick={() => scrollToSection('process')}
                  className="rounded-xl border border-black/10 bg-[#e6ead7] px-6 py-3.5 font-semibold text-zinc-900 transition hover:bg-[#dbe1c8]"
                >
                  {content.processCta}
                </button>
              </div>

              <div className="mt-10 border-t border-black/10 pt-5">
                <div className="flex flex-wrap items-center gap-3 text-zinc-700">
                  <div className="flex items-center gap-1 text-[#0d4d38]">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="text-sm">{content.recommendation}</span>
                </div>
              </div>
            </div>

            <article className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/10 backdrop-blur-xl shadow-xl shadow-black/10">
              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.86),rgba(255,255,255,0.22)_42%,transparent_72%)] p-6 md:min-h-[520px] md:p-8">
                <div className="pointer-events-none absolute inset-x-[12%] top-10 h-24 rounded-full bg-white/35 blur-3xl"></div>
                <div className="pointer-events-none absolute inset-x-[15%] bottom-8 h-16 rounded-full bg-[#e7dcc8]/55 blur-3xl"></div>
                <img
                  src="/hero-principal.webp"
                  alt="Vista previa de aplicación móvil"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={760}
                  height={760}
                  className="relative z-10 h-full max-h-[540px] w-full object-contain animate-[float_7s_ease-in-out_infinite] drop-shadow-[0_26px_40px_rgba(0,0,0,0.16)]"
                />
              </div>
            </article>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 rounded-2xl border border-black/10 bg-white/30 px-3 py-2 backdrop-blur-2xl shadow-xl shadow-black/10 md:flex md:items-center md:gap-1">
        {content.dockItems.map((item) => (
          <button
            key={item.target}
            onClick={() => scrollToSection(item.target)}
            className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white/40 hover:text-zinc-900"
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => scrollToSection('contact')}
          className="ml-2 rounded-xl bg-[#0d4d38] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b3f2f]"
        >
          {content.navCta}
        </button>
      </nav>

      <div className="fixed bottom-6 left-6 z-50 md:hidden">
        <button
          type="button"
          onClick={() => setMobileDockOpen((v) => !v)}
          className="cx-card cx-card-hover flex h-14 w-14 items-center justify-center"
          aria-label={mobileDockOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileDockOpen ? <X className="h-6 w-6 text-zinc-900" /> : <Menu className="h-6 w-6 text-zinc-900" />}
        </button>

        {mobileDockOpen && (
          <div className="mt-3 w-[min(78vw,320px)] rounded-2xl cx-card p-2">
            {content.dockItems.map((item) => (
              <button
                key={item.target}
                onClick={() => {
                  setMobileDockOpen(false);
                  scrollToSection(item.target);
                }}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-white/25"
              >
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4 text-zinc-700" />
              </button>
            ))}
            <button
              onClick={() => {
                setMobileDockOpen(false);
                scrollToSection('contact');
              }}
              className="mt-2 w-full rounded-xl bg-[#0d4d38] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3f2f]"
            >
              {content.navCta}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}



