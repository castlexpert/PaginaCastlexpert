import {
  Smartphone,
  Package,
  ClipboardList,
  Wrench,
  Users,
  DollarSign,
  CalendarClock,
  Bell,
  BarChart3,
  TrendingUp,
  Globe,
  Monitor,
  ServerCog,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AppCopy } from '../i18n';
import ServiceModal, { type ServiceModalContent } from './ServiceModal';

/** Miniaturas (derivadas de cada imagen del modal) para fondo de cards DEMOS — ver `npm run demo:card-thumbs`. */
const DEMO_CARD_BACKGROUNDS = [
  '/images/demos/soluciones-personales-card.webp',
  '/images/demos/soluciones-familiares-card.webp',
  '/images/demos/soluciones-empresa-card.webp',
  '/images/demos/soluciones-pyme-card.webp',
] as const;

/** Encuadre fino por card (mockups distintos: retrato vs landing largo). */
const DEMO_CARD_OBJECT: Record<number, string> = {
  0: 'object-[50%_28%]',
  1: 'object-[50%_35%]',
  2: 'object-[50%_8%]',
  3: 'object-[50%_30%]',
};

const serviceIcons = [
  Smartphone,
  Package,
  ClipboardList,
  Wrench,
  Users,
  DollarSign,
  CalendarClock,
  Bell,
  BarChart3,
  TrendingUp,
  ServerCog,
];

const mainServiceIcons = [Smartphone, Globe, Monitor];

type ServicesProps = {
  content: AppCopy['services'];
};

export default function Services({ content }: ServicesProps) {
  const [active, setActive] = useState<{ kind: 'item' | 'main' | 'demo'; index: number } | null>(null);

  const activeModal: ServiceModalContent | null = useMemo(() => {
    if (!active) return null;
    if (active.kind === 'demo') return content.demos.modals[active.index] ?? null;
    const source = active.kind === 'item' ? content.itemModals : content.mainModals;
    return source[active.index] ?? null;
  }, [active, content.demos.modals, content.itemModals, content.mainModals]);

  return (
    <section id="services" className="py-24 relative bg-[#f2efe8]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f2efe8] via-[#f6f3ec] to-[#ece8df]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">{content.title}</h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {content.items.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActive({ kind: 'item', index })}
                className="group p-6 cx-card cx-card-hover hover:-translate-y-1 text-left"
                aria-label={`${service.title}. Ver detalle`}
              >
                <div className="w-12 h-12 rounded-lg cx-card-surface flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-black/5">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{service.title}</h3>
                <p className="text-zinc-600">{service.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-14">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black mb-3 text-black">{content.demos.title}</h3>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">{content.demos.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.demos.items.map((item, index) => {
              const thumbSrc = DEMO_CARD_BACKGROUNDS[index];
              const modalMeta = content.demos.modals[index];
              const galleryAlt = modalMeta?.galleryAlt?.trim() ?? '';
              const cardVisual =
                thumbSrc && modalMeta
                  ? { url: thumbSrc, alt: galleryAlt }
                  : null;
              const objClass = DEMO_CARD_OBJECT[index] ?? 'object-center';
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive({ kind: 'demo', index })}
                  className={[
                    'group relative overflow-hidden text-left transition-transform hover:-translate-y-1',
                    cardVisual
                      ? [
                          'flex flex-col aspect-[4/5] w-full max-h-[min(420px,70vw)] rounded-2xl border border-white/20 bg-zinc-900 p-0',
                          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-black/10 sm:max-h-[460px]',
                        ].join(' ')
                      : 'cx-card cx-card-hover min-h-[200px] p-6',
                  ].join(' ')}
                  aria-label={
                    cardVisual?.alt ? `${item.title}. ${cardVisual.alt} Ver detalle` : `${item.title}. Ver detalle`
                  }
                >
                  {cardVisual ? (
                    <>
                      <span className="absolute inset-0 block overflow-hidden rounded-[inherit]">
                        <img
                          src={cardVisual.url}
                          alt={cardVisual.alt}
                          className={[
                            'h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]',
                            objClass,
                          ].join(' ')}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      {/* Oscurece solo la parte baja para el texto; la mitad superior muestra la foto con claridad */}
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] bg-gradient-to-t from-black/92 via-black/45 to-transparent"
                        aria-hidden
                      />
                      <div className="relative z-10 mt-auto w-full p-5 pt-12 sm:p-6">
                        <h4 className="text-lg font-extrabold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85)] sm:text-xl">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm leading-snug text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
                          {item.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="text-xl font-extrabold text-black mb-2">{item.title}</h4>
                      <p className="text-zinc-600">{item.description}</p>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">{content.mainTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.mainItems.map((service, index) => {
              const Icon = mainServiceIcons[index];
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive({ kind: 'main', index })}
                  className="group relative p-8 cx-card cx-card-hover hover:-translate-y-2 text-left"
                  aria-label={`${service.title}. Ver detalle`}
                >
                  <div className="w-16 h-16 rounded-xl cx-card-surface flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md shadow-black/5">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h4 className="text-2xl font-bold text-black mb-3">{service.title}</h4>
                  <p className="text-zinc-600 text-lg">{service.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ServiceModal
        open={Boolean(activeModal)}
        onClose={() => setActive(null)}
        content={
          activeModal ?? {
            title: '',
            description: '',
            highlights: [],
            images: [],
            links: [],
          }
        }
        labels={content.modalLabels}
      />
    </section>
  );
}
