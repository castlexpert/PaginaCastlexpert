/** High-attention AI chat launcher mark (orb + big dynamic eyes). */
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
        <svg viewBox="0 0 48 24" className="h-3.5 w-7" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="10" fill="#f7f3ea" />
          <ellipse cx="36" cy="12" rx="9" ry="10" fill="#f7f3ea" />
          <g className="cx-ai-pupil">
            <circle cx="12" cy="12.5" r="4.2" fill="#072a1f" />
            <circle cx="36" cy="12.5" r="4.2" fill="#072a1f" />
            <circle cx="10.4" cy="10.6" r="1.3" fill="#fff" opacity="0.9" />
            <circle cx="34.4" cy="10.6" r="1.3" fill="#fff" opacity="0.9" />
          </g>
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
              <stop stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="0.55" stopColor="#1a7a58" stopOpacity="0.25" />
              <stop offset="1" stopColor="#072a1f" stopOpacity="0.15" />
            </radialGradient>
          </defs>

          <g className="cx-ai-mesh" stroke="url(#cxAiStroke)" strokeWidth="1.15" opacity="0.42">
            <path d="M32 14 L46 22 L46 42 L32 50 L18 42 L18 22 Z" />
            <path d="M32 14 L32 50 M18 22 L46 42 M46 22 L18 42" />
          </g>

          <circle cx="32" cy="14" r="2.2" fill="#f7f3ea" className="cx-ai-node" />
          <circle cx="46" cy="22" r="2" fill="#e8d7a8" className="cx-ai-node cx-ai-node--d1" />
          <circle cx="46" cy="42" r="2" fill="#9fe8c8" className="cx-ai-node cx-ai-node--d2" />
          <circle cx="32" cy="50" r="2.2" fill="#f7f3ea" className="cx-ai-node cx-ai-node--d3" />
          <circle cx="18" cy="42" r="2" fill="#e8d7a8" className="cx-ai-node cx-ai-node--d4" />
          <circle cx="18" cy="22" r="2" fill="#9fe8c8" className="cx-ai-node cx-ai-node--d5" />

          <circle cx="32" cy="32" r="10" fill="url(#cxAiCore)" className="cx-ai-core" />
        </svg>
      </span>

      {/* Big eyes in the former AI-badge spot */}
      <span className="cx-ai-eyes-badge" title="AI assistant">
        <svg viewBox="0 0 56 28" className="cx-ai-eyes-svg" fill="none" aria-hidden="true">
          <g className="cx-ai-eye cx-ai-eye--left">
            <ellipse cx="14" cy="14" rx="11.5" ry="12.5" fill="#f7f3ea" />
            <g className="cx-ai-pupil">
              <circle cx="14" cy="14.5" r="5.4" fill="#072a1f" />
              <circle cx="11.8" cy="12.2" r="1.7" fill="#fff" opacity="0.92" />
            </g>
          </g>
          <g className="cx-ai-eye cx-ai-eye--right">
            <ellipse cx="42" cy="14" rx="11.5" ry="12.5" fill="#f7f3ea" />
            <g className="cx-ai-pupil">
              <circle cx="42" cy="14.5" r="5.4" fill="#072a1f" />
              <circle cx="39.8" cy="12.2" r="1.7" fill="#fff" opacity="0.92" />
            </g>
          </g>
        </svg>
      </span>
    </span>
  );
}
