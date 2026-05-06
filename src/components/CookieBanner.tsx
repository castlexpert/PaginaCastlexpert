import type { AppCopy } from '../i18n';

const STORAGE_KEY = 'castlexpert_cookie_consent_v1';
const STORAGE_VALUE = 'accepted';

export function hasStoredCookieConsent(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === STORAGE_VALUE;
  } catch {
    return false;
  }
}

export function storeCookieConsent(): void {
  try {
    localStorage.setItem(STORAGE_KEY, STORAGE_VALUE);
  } catch {
    /* ignore */
  }
}

type CookieBannerProps = {
  content: AppCopy['cookies'];
  visible: boolean;
  onAccept: () => void;
  onOpenPolicy: () => void;
};

export default function CookieBanner({ content, visible, onAccept, onOpenPolicy }: CookieBannerProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-black/10 bg-[#ebe6dd]/95 px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:px-6"
      role="dialog"
      aria-modal="false"
      aria-label={content.bannerAriaLabel}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-zinc-800 sm:text-[15px]">{content.bannerText}</p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onOpenPolicy}
            className="whitespace-nowrap rounded-2xl border border-black/15 bg-white/30 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white/50"
          >
            {content.policyLink}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-2xl bg-[#0d4d38] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3f2f]"
          >
            {content.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
