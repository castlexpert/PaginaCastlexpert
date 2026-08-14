import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SimplePageHeader from '../components/SimplePageHeader';
import type { AppCopy } from '../i18n';
import { siteMockups } from '../data/mockups';

type MockupsPageProps = {
  content: AppCopy;
  onToggleLanguage: () => void;
  onOpenCookiePolicy: () => void;
};

export default function MockupsPage({ content, onToggleLanguage, onOpenCookiePolicy }: MockupsPageProps) {
  const copy = content.mockups;

  return (
    <>
      <SimplePageHeader languageButton={content.hero.languageButton} onToggleLanguage={onToggleLanguage} />

      <main id="contenido-principal">
        <section className="relative overflow-hidden border-b border-black/8 bg-[#0d4d38]">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{copy.eyebrow}</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-white sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">{copy.subtitle}</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {siteMockups.map((mockup) => {
              const item = copy.items.find((i) => i.id === mockup.id);
              if (!item) return null;
              return (
                <a
                  key={mockup.id}
                  href={mockup.pagePath}
                  className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-zinc-900 text-left shadow-xl ring-1 ring-black/10 transition hover:-translate-y-1"
                >
                  {mockup.image ? (
                    <span className="absolute inset-0 block overflow-hidden">
                      <img
                        src={mockup.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  ) : null}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20"
                    aria-hidden
                  />
                  <div className="relative z-10 mt-auto flex w-full flex-col gap-4 p-6 sm:p-7">
                    <div>
                      <h2 className="text-2xl font-extrabold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-snug text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
                        {item.description}
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0d4d38] transition group-hover:bg-zinc-100">
                      {copy.openLabel}
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          <Link
            to="/"
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-[#0d4d38]"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.backHome}
          </Link>
        </section>
      </main>

      <Footer content={content.footer} onOpenCookiePolicy={onOpenCookiePolicy} />
    </>
  );
}
