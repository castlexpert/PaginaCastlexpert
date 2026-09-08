/** High-attention AI chat launcher mark (orb + neural constellation). */
export default function ChatLauncherIcon({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <span className={['relative inline-flex h-full w-full items-center justify-center', className].join(' ')} aria-hidden="true">
        <svg viewBox="0 0 64 64" className="h-4 w-4" fill="none">
          <defs>
            <linearGradient id="cxAiMini" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e8d7a8" />
              <stop offset="1" stopColor="#f7f3ea" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="10" stroke="url(#cxAiMini)" strokeWidth="1.6" opacity="0.9" />
          <circle cx="32" cy="32" r="3.6" fill="url(#cxAiMini)" />
          <circle cx="32" cy="18" r="1.8" fill="#e8d7a8" />
          <circle cx="46" cy="32" r="1.8" fill="#e8d7a8" />
          <circle cx="32" cy="46" r="1.8" fill="#e8d7a8" />
          <circle cx="18" cy="32" r="1.8" fill="#e8d7a8" />
        </svg>
      </span>
    );
  }

  return (
    <span className={['cx-ai-orb relative inline-flex h-full w-full items-center justify-center', className].join(' ')} aria-hidden="true">
      <span className="cx-ai-aura" />
      <span className="cx-ai-ring cx-ai-ring--1" />
      <span className="cx-ai-ring cx-ai-ring--2" />
      <span className="cx-ai-ring cx-ai-ring--3" />

      <span className="cx-ai-orbit cx-ai-orbit--a">
        <span className="cx-ai-spark" />
      </span>
      <span className="cx-ai-orbit cx-ai-orbit--b">
        <span className="cx-ai-spark cx-ai-spark--gold" />
      </span>
      <span className="cx-ai-orbit cx-ai-orbit--c">
        <span className="cx-ai-spark" />
      </span>

      <span className="cx-ai-glass">
        <span className="cx-ai-shimmer" />
        <svg viewBox="0 0 64 64" className="cx-ai-constellation relative z-[1] h-8 w-8" fill="none">
          <defs>
            <linearGradient id="cxAiStroke" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f7f3ea" />
              <stop offset="0.55" stopColor="#e8d7a8" />
              <stop offset="1" stopColor="#9fe8c8" />
            </linearGradient>
            <radialGradient id="cxAiCore" cx="50%" cy="45%" r="55%">
              <stop stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="#e8d7a8" stopOpacity="0.95" />
              <stop offset="1" stopColor="#1a7a58" stopOpacity="0.35" />
            </radialGradient>
          </defs>

          {/* Neural mesh */}
          <g className="cx-ai-mesh" stroke="url(#cxAiStroke)" strokeWidth="1.15" opacity="0.55">
            <path d="M32 14 L46 22 L46 42 L32 50 L18 42 L18 22 Z" />
            <path d="M32 14 L32 50 M18 22 L46 42 M46 22 L18 42" />
          </g>

          <circle cx="32" cy="14" r="2.4" fill="#f7f3ea" className="cx-ai-node" />
          <circle cx="46" cy="22" r="2.2" fill="#e8d7a8" className="cx-ai-node cx-ai-node--d1" />
          <circle cx="46" cy="42" r="2.2" fill="#9fe8c8" className="cx-ai-node cx-ai-node--d2" />
          <circle cx="32" cy="50" r="2.4" fill="#f7f3ea" className="cx-ai-node cx-ai-node--d3" />
          <circle cx="18" cy="42" r="2.2" fill="#e8d7a8" className="cx-ai-node cx-ai-node--d4" />
          <circle cx="18" cy="22" r="2.2" fill="#9fe8c8" className="cx-ai-node cx-ai-node--d5" />

          <circle cx="32" cy="32" r="7.2" fill="url(#cxAiCore)" className="cx-ai-core" />
          <circle cx="32" cy="32" r="3.1" fill="#072a1f" opacity="0.35" />
          <circle cx="32" cy="32" r="1.7" fill="#fff" className="cx-ai-core-dot" />
        </svg>
      </span>

      <span className="cx-ai-live" title="AI">
        <span className="cx-ai-live-dot" />
        AI
      </span>
    </span>
  );
}
