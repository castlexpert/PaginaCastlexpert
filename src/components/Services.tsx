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
  RefreshCw,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AppCopy } from '../i18n';
import ServiceModal, { type ServiceModalContent } from './ServiceModal';

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

const mainServiceIcons = [Smartphone, Globe, Monitor, RefreshCw];

type ServicesProps = {
  content: AppCopy['services'];
  /** solutions = Nuestras Soluciones; main = Servicios principales */
  variant: 'solutions' | 'main';
};

export default function Services({ content, variant }: ServicesProps) {
  const [active, setActive] = useState<{ kind: 'item' | 'main'; index: number } | null>(null);

  const activeModal: ServiceModalContent | null = useMemo(() => {
    if (!active) return null;
    const source = active.kind === 'item' ? content.itemModals : content.mainModals;
    return source[active.index] ?? null;
  }, [active, content.itemModals, content.mainModals]);

  if (variant === 'solutions') {
    return (
      <section id="solutions" className="relative bg-[#f2efe8] py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f2efe8] via-[#f6f3ec] to-[#ece8df]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-black md:text-5xl">{content.title}</h2>
            <p className="mx-auto max-w-2xl text-xl text-zinc-600">{content.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.items.map((service, index) => {
              const Icon = serviceIcons[index];
              const thumb = content.itemModals[index]?.images?.[0];
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive({ kind: 'item', index })}
                  className={[
                    'group overflow-hidden text-left transition hover:-translate-y-1',
                    thumb
                      ? 'flex flex-col rounded-2xl border border-black/10 bg-zinc-900 shadow-lg ring-1 ring-black/10'
                      : 'cx-card cx-card-hover p-6',
                  ].join(' ')}
                  aria-label={`${service.title}. Ver detalle`}
                >
                  {thumb ? (
                    <>
                      <span className="relative block h-36 w-full overflow-hidden sm:h-40">
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/90 shadow-md">
                          <Icon className="h-5 w-5 text-black" />
                        </span>
                      </span>
                      <span className="p-5">
                        <h3 className="text-lg font-bold text-white">{service.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/85">{service.description}</p>
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg cx-card-surface shadow-md shadow-black/5 transition-transform group-hover:scale-110">
                        <Icon className="h-6 w-6 text-black" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-black">{service.title}</h3>
                      <p className="text-zinc-600">{service.description}</p>
                    </>
                  )}
                </button>
              );
            })}
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

  return (
    <section id="services" className="relative bg-[#ece8df] py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ece8df] via-[#f2efe8] to-[#e8e4db]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-black md:text-4xl">{content.mainTitle}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {content.mainItems.map((service, index) => {
            const Icon = mainServiceIcons[index] ?? RefreshCw;
            const thumb = content.mainModals[index]?.images?.[0];
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActive({ kind: 'main', index })}
                className={[
                  'group relative overflow-hidden text-left transition hover:-translate-y-2',
                  thumb ? 'rounded-2xl border border-black/10 bg-zinc-900 shadow-xl' : 'cx-card cx-card-hover p-8',
                ].join(' ')}
                aria-label={`${service.title}. Ver detalle`}
              >
                {thumb ? (
                  <>
                    <span className="relative block h-44 w-full overflow-hidden">
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/90">
                        <Icon className="h-7 w-7 text-black" />
                      </span>
                    </span>
                    <span className="block p-6">
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      <p className="mt-2 text-base text-white/85">{service.description}</p>
                    </span>
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl cx-card-surface shadow-md shadow-black/5 transition-transform group-hover:scale-110">
                      <Icon className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-black">{service.title}</h3>
                    <p className="text-lg text-zinc-600">{service.description}</p>
                  </>
                )}
              </button>
            );
          })}
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
