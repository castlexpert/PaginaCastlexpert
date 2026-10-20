import { ArrowUpRight } from 'lucide-react';
import type { AppCopy } from '../i18n';
import { freeTools } from '../data/freeTools';

type FreeToolsSectionProps = {
  content: AppCopy['freeTools'];
};

export default function FreeToolsSection({ content }: FreeToolsSectionProps) {
  return (
    <section id="herramientas-gratis" className="relative scroll-mt-24 bg-[#e4e0d6] py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#e8e4db] via-[#ebe7de] to-[#e0dbd1]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0d4d38]">{content.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black text-black md:text-5xl">{content.sectionTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-zinc-600">{content.sectionSubtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {freeTools.map((tool) => {
            const item = content.items.find((i) => i.id === tool.id);
            if (!item) return null;
            return (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[380px] w-full flex-col overflow-hidden sm:w-[calc(50%-0.75rem)] xl:w-[calc((100%-3rem)/3)] rounded-2xl border border-black/10 bg-zinc-900 text-left shadow-xl ring-1 ring-black/10 transition hover:-translate-y-1"
                aria-label={`${item.title}. ${content.ctaLabel}`}
              >
                <span className="absolute inset-0 block overflow-hidden bg-[#f4f1ea]">
                  <img
                    src={tool.image}
                    alt=""
                    className="h-full w-full object-contain p-6 transition duration-700 ease-out group-hover:scale-[1.03] sm:p-8"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10"
                  aria-hidden
                />
                <div className="relative z-10 mt-auto flex w-full flex-col gap-4 p-6 sm:p-7">
                  <div>
                    <span className="inline-flex rounded-md bg-[#0d4d38]/px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      {content.badge}
                    </span>
                    <h3 className="mt-3 text-2xl font-extrabold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-snug text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
                      {item.cardDescription}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0d4d38] transition group-hover:bg-zinc-100">
                    {content.ctaLabel}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
