import { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AppCopy } from '../i18n';

type HowItWorksProps = {
  content: AppCopy['process'];
};

export default function HowItWorks({ content }: HowItWorksProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const steps = useMemo(
    () =>
      content.steps.map((step, index) => ({
        step,
        index,
      })),
    [content.steps]
  );

  const scrollByCards = (direction: 'prev' | 'next') => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>('[data-step-card="true"]');
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = 24;
    const delta = (cardWidth + gap) * (direction === 'next' ? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#f8f6f1]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f6f1] via-[#f3f0e8] to-[#f8f6f1]"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">{content.title}</h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="relative">
          <div className="hidden md:flex items-center justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => scrollByCards('prev')}
              className="cx-card cx-card-hover flex items-center justify-center h-10 w-10"
              aria-label="Ver paso anterior"
              title="Anterior"
            >
              <ChevronLeft className="h-5 w-5 text-zinc-900" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards('next')}
              className="cx-card cx-card-hover flex items-center justify-center h-10 w-10"
              aria-label="Ver siguiente paso"
              title="Siguiente"
            >
              <ChevronRight className="h-5 w-5 text-zinc-900" />
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
          >
            {steps.map(({ step, index }) => (
              <div
                key={index}
                className="relative snap-start shrink-0 w-[82%] sm:w-[420px] lg:w-[360px]"
                data-step-card="true"
              >
                <div className="relative overflow-hidden cx-card cx-card-hover h-full">
                  {step.image && (
                    <div className="relative h-44 w-full sm:h-48">
                      <img
                        src={step.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/25"></div>
                    </div>
                  )}

                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-black/30 border border-white/10">
                    {step.number}
                  </div>

                  <div className="relative p-8">
                    <h3 className="text-2xl font-bold text-black mb-3">{step.title}</h3>
                    <p className="text-zinc-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-zinc-600 md:hidden">
            Desliza horizontalmente para ver los pasos.
          </p>
        </div>
      </div>
    </section>
  );
}
