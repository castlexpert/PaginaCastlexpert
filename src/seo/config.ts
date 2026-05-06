import type { Language } from '../i18n';

/** URL canónica del sitio (build: opcional `VITE_SITE_URL`). */
export function getSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '');
  return fromEnv || 'https://castlexpert.com';
}

export type PageSeo = {
  title: string;
  description: string;
  keywords: string;
};

export const seoByLang: Record<Language, PageSeo> = {
  es: {
    title: 'CastleXpert | Apps y arquitectura digital para tu negocio — Costa Rica',
    description:
      'Diseño de aplicaciones móviles, sistemas a medida y automatización para empresas en Costa Rica. Proceso claro, entrega ágil y soporte CastleXpert.',
    keywords:
      'CastleXpert, desarrollo de apps, apps Costa Rica, software a medida, automatización, arquitectura digital, aplicaciones móviles, sistemas empresariales',
  },
  en: {
    title: 'CastleXpert | Mobile apps & digital architecture for your business',
    description:
      'Custom mobile apps, tailored systems, and automation for businesses. Clear process, agile delivery, and ongoing support from CastleXpert, Costa Rica.',
    keywords:
      'CastleXpert, mobile app development, custom software, business automation, digital architecture, Costa Rica, mobile solutions',
  },
};
