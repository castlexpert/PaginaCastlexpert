import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AppCopy, Language } from '../i18n';
import { oracleMigrationUrl } from '../lib/siteLanguage';

type OracleMigrationSectionProps = {
  content: AppCopy['oracleMigration'];
  language: Language;
};

export default function OracleMigrationSection({ content, language }: OracleMigrationSectionProps) {
  const serviceUrl = oracleMigrationUrl(language);

  return (
    <section id="migracion-oracle" className="relative scroll-mt-24 overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a2e24] via-[#0d4d38] to-[#072a1f]" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#c4a35a]/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e8d7a8]">{content.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-white md:text-5xl">{content.sectionTitle}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">{content.sectionSubtitle}</p>

            <ul className="mt-8 space-y-3">
              {content.promises.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/90 sm:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c4a35a]/25 text-[#e8d7a8]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={serviceUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0d4d38] transition hover:bg-zinc-100"
              >
                {content.ctaDetails}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {content.ctaContact}
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {content.versions.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-white/90"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          <a
            href={serviceUrl}
            className="group relative block overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/30 ring-1 ring-black/20"
            aria-label={content.ctaDetails}
          >
            <img
              src="/images/services/oracle-migration.webp"
              alt={content.imageAlt}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-black/45 px-4 py-3 text-sm text-white backdrop-blur">
              {content.imageCaption}
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
