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
];

const mainServiceIcons = [Smartphone, Globe, Monitor];

type ServicesProps = {
  content: AppCopy['services'];
};

export default function Services({ content }: ServicesProps) {
  const [active, setActive] = useState<{ kind: 'item' | 'main'; index: number } | null>(null);

  const activeModal: ServiceModalContent | null = useMemo(() => {
    if (!active) return null;
    const source = active.kind === 'item' ? content.itemModals : content.mainModals;
    return source[active.index] ?? null;
  }, [active, content.itemModals, content.mainModals]);

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
          }
        }
        labels={content.modalLabels}
      />
    </section>
  );
}
