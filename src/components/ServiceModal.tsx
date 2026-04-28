import { useEffect } from 'react';
import { X } from 'lucide-react';

export type ServiceModalContent = {
  title: string;
  description: string;
  highlights: string[];
  images: string[];
};

type ServiceModalProps = {
  open: boolean;
  onClose: () => void;
  content: ServiceModalContent;
  labels: {
    close: string;
    gallery: string;
    highlights: string;
  };
};

export default function ServiceModal({ open, onClose, content, labels }: ServiceModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label={labels.close}
        onClick={onClose}
      />

      <div className="relative mx-auto flex h-[100dvh] max-w-5xl items-end px-3 pb-3 sm:items-center sm:px-6 sm:pb-0">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={content.title}
          className="relative w-full max-h-[92dvh] overflow-hidden rounded-3xl cx-card shadow-2xl shadow-black/30 sm:max-h-[88vh]"
        >
          <div className="flex h-full flex-col">
            <div className="sticky top-0 z-10 border-b border-white/10 bg-white/10 backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-zinc-950 sm:text-3xl">{content.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm text-zinc-700 sm:text-base">{content.description}</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition hover:bg-white/20"
                  aria-label={labels.close}
                  title={labels.close}
                >
                  <X className="h-6 w-6 text-zinc-900" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-[0.18em] text-zinc-700">
                    {labels.gallery}
                  </h4>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {(content.images?.length ? content.images : ['', '', '', '']).map((src, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10"
                      >
                        {src ? (
                          <img
                            src={src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-40 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center text-sm font-semibold text-zinc-600">
                            Imagen
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="rounded-3xl bg-white/10 p-5 backdrop-blur-2xl border border-white/10">
                  <h4 className="text-sm font-extrabold uppercase tracking-[0.18em] text-zinc-700">
                    {labels.highlights}
                  </h4>
                  <ul className="mt-4 space-y-3 text-zinc-800">
                    {content.highlights.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:hidden"
              >
                {labels.close}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

