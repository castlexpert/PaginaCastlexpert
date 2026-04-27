import { Smartphone, FolderKanban, Cloud, Zap, CircleDollarSign } from 'lucide-react';
import type { AppCopy } from '../i18n';

const benefitIcons = [Smartphone, FolderKanban, Cloud, Zap, CircleDollarSign];

type BenefitsProps = {
  content: AppCopy['benefits'];
};

export default function Benefits({ content }: BenefitsProps) {
  return (
    <section className="py-24 relative overflow-hidden bg-[#f1ede5]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1ede5] via-[#f6f3ec] to-[#efebe3]"></div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-400/15 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">{content.title}</h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((benefit, index) => {
            const Icon = benefitIcons[index];
            return (
              <div
                key={index}
                className="relative p-8 cx-card cx-card-hover h-full"
              >
                <div className="w-14 h-14 rounded-xl cx-card-surface flex items-center justify-center mb-6 shadow-md shadow-black/5">
                  <Icon className="w-7 h-7 text-black" />
                </div>

                <h3 className="text-2xl font-bold text-black mb-3">{benefit.title}</h3>

                <p className="text-zinc-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 md:p-12 rounded-3xl cx-card cx-card-hover text-center">
          <h3 className="text-3xl font-bold text-black mb-4">{content.ctaTitle}</h3>
          <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">{content.ctaDescription}</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-black rounded-lg font-semibold text-white hover:bg-zinc-800 transition-all duration-300"
          >
            {content.ctaButton}
          </button>
        </div>
      </div>
    </section>
  );
}
