import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AppCopy } from '../i18n';
import { functionalDemos } from '../data/functionalDemos';

type FunctionalDemosSectionProps = {
  content: AppCopy['functionalDemos'];
};

export default function FunctionalDemosSection({ content }: FunctionalDemosSectionProps) {
  return (
    <section id="demos" className="relative scroll-mt-24 bg-[#ece8df] py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ece8df] via-[#f2efe8] to-[#e8e4db]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0d4d38]">{content.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black text-black md:text-5xl">{content.sectionTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-zinc-600">{content.sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {functionalDemos.map((demo) => {
            const item = content.items.find((i) => i.id === demo.id);
            if (!item) return null;
            return (
              <Link
                key={demo.id}
                to={demo.pagePath}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-zinc-900 text-left shadow-xl ring-1 ring-black/10 transition hover:-translate-y-1"
                aria-label={`${item.title}. ${content.ctaLabel}`}
              >
                <span className="absolute inset-0 block overflow-hidden">
                  <img
                    src={demo.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15"
                  aria-hidden
                />
                <div className="relative z-10 mt-auto flex w-full flex-col gap-4 p-6 sm:p-7">
                  <div>
                    <h3 className="text-2xl font-extrabold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-snug text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
                      {item.cardDescription}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0d4d38] transition group-hover:bg-zinc-100">
                    {content.ctaLabel}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                  {demo.apkSlug ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75">
                      <Download className="h-3.5 w-3.5" />
                      APK
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
