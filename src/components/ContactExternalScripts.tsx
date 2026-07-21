import { useEffect } from 'react';

/**
 * Scripts opcionales solo en /contacto para publicidad / conversion tracking externo.
 * Configura en Railway (build vars):
 * - VITE_CONTACT_META_PIXEL_ID
 * - VITE_CONTACT_GOOGLE_ADS_ID (ej. AW-XXXXXXXX)
 * - VITE_CONTACT_GOOGLE_ADS_LABEL (label de conversión, opcional)
 */
export default function ContactExternalScripts() {
  const metaPixelId = import.meta.env.VITE_CONTACT_META_PIXEL_ID?.trim();
  const googleAdsId = import.meta.env.VITE_CONTACT_GOOGLE_ADS_ID?.trim();
  const googleAdsLabel = import.meta.env.VITE_CONTACT_GOOGLE_ADS_LABEL?.trim();

  useEffect(() => {
    if (metaPixelId) {
      const w = window as Window & { fbq?: (...args: unknown[]) => void };
      if (!w.fbq) {
        const stub = function (...args: unknown[]) {
          (stub as { callMethod?: (...a: unknown[]) => void; queue: unknown[] }).queue.push(args);
        } as ((...args: unknown[]) => void) & { queue: unknown[]; loaded?: boolean; version?: string };
        stub.queue = [];
        stub.loaded = true;
        stub.version = '2.0';
        w.fbq = stub;
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(s);
      }
      w.fbq?.('init', metaPixelId);
      w.fbq?.('track', 'PageView');
    }

    if (googleAdsId) {
      const existing = document.querySelector(`script[data-cx-gtag="${googleAdsId}"]`);
      if (!existing) {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAdsId)}`;
        s.setAttribute('data-cx-gtag', googleAdsId);
        document.head.appendChild(s);
      }

      const w = window as Window & {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
      };
      w.dataLayer = w.dataLayer || [];
      if (!w.gtag) {
        w.gtag = function gtag(...args: unknown[]) {
          w.dataLayer?.push(args);
        };
      }
      w.gtag('js', new Date());
      w.gtag('config', googleAdsId);
      if (googleAdsLabel) {
        w.gtag('event', 'conversion', {
          send_to: `${googleAdsId}/${googleAdsLabel}`,
        });
      }
    }
  }, [metaPixelId, googleAdsId, googleAdsLabel]);

  return null;
}
