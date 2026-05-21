import { Star, TrendingUp, Users } from 'lucide-react';
import type { AppCopy } from '../i18n';

type TrustBarProps = {
  content: AppCopy['hero'];
};

export default function TrustBar({ content }: TrustBarProps) {
  const items = [
    { icon: Star, label: content.recommendation },
    { icon: TrendingUp, label: content.growthStat },
    { icon: Users, label: content.activeClients },
  ];

  return (
    <section className="relative border-y border-black/10 bg-white/35 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white/30 px-5 py-4 shadow-sm"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0d4d38]/10 text-[#0d4d38]">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <p className="text-sm font-semibold leading-snug text-zinc-800 md:text-base">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
