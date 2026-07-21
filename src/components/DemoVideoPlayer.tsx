import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { trackEvent } from '../lib/siteAnalytics';

type DemoVideoPlayerProps = {
  open: boolean;
  src: string;
  title: string;
  poster?: string;
  onClose: () => void;
  closeLabel: string;
};

/** Reproductor ligero: el MP4 solo se carga al abrir (preload none + src al montar). */
export default function DemoVideoPlayer({ open, src, title, poster, onClose, closeLabel }: DemoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    trackEvent('demo_video_open', { src, title });
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {
      /* autoplay puede fallar sin interacción previa; controls permiten play manual */
    });
    return () => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    };
  }, [open, src, title]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <p className="truncate text-sm font-semibold text-white sm:text-base">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative aspect-video bg-black">
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            playsInline
            preload="none"
            className="h-full w-full object-contain"
            onLoadedData={() => setReady(true)}
          />
        </div>
      </div>
    </div>
  );
}

export function DemoVideoLinkButton({
  playLabel,
  onClick,
}: {
  playLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-track="demo_video_link"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d4d38] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#0b3f2f]"
    >
      <Play className="h-3.5 w-3.5 fill-current" />
      {playLabel}
    </button>
  );
}
