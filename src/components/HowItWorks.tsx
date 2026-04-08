import { Lightbulb, Pencil, Rocket, Headphones as HeadphonesIcon } from 'lucide-react';
import type { AppCopy } from '../i18n';

const stepIcons = [Lightbulb, Pencil, Rocket, HeadphonesIcon];

type HowItWorksProps = {
  content: AppCopy['process'];
};

export default function HowItWorks({ content }: HowItWorksProps) {
  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#f8f6f1]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f6f1] via-[#f3f0e8] to-[#f8f6f1]"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">{content.title}</h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <div key={index} className="relative">
                {index < content.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-black/30 to-transparent"></div>
                )}

                <div className="relative p-8 rounded-2xl bg-white/25 backdrop-blur-2xl border border-black/15 hover:border-black/25 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 h-full">
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-black/25">
                    {step.number}
                  </div>

                  <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center mb-6 shadow-md shadow-black/5">
                    <Icon className="w-8 h-8 text-black" />
                  </div>

                  <h3 className="text-2xl font-bold text-black mb-3">{step.title}</h3>

                  <p className="text-zinc-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
