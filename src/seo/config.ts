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

export const seoSiteMapByLang: Record<Language, PageSeo> = {
  es: {
    title: 'Mapa del sitio | CastleXpert',
    description: 'Índice de secciones y páginas públicas de CastleXpert: servicios, proceso, contacto y más.',
    keywords: 'CastleXpert, mapa del sitio, navegación, páginas, Costa Rica',
  },
  en: {
    title: 'Site map | CastleXpert',
    description:
      'Index of CastleXpert public sections and pages: services, process, contact, policies, and more.',
    keywords: 'CastleXpert, site map, navigation, pages, Costa Rica',
  },
};

export const seoAboutByLang: Record<Language, PageSeo> = {
  es: {
    title: 'Acerca de CastleXpert | Quiénes somos',
    description:
      'CastleXpert diseña aplicaciones y arquitectura digital para empresas y proyectos en Costa Rica, con proceso claro y soporte cercano.',
    keywords: 'CastleXpert, acerca de, empresa, Costa Rica, apps, arquitectura digital',
  },
  en: {
    title: 'About CastleXpert | Who we are',
    description:
      'CastleXpert designs mobile apps and digital architecture for businesses and projects—with a clear process and hands-on support from Costa Rica.',
    keywords: 'CastleXpert, about, company, Costa Rica, apps, digital architecture',
  },
};

export const seoContactCardByLang: Record<Language, PageSeo> = {
  es: {
    title: 'Deiby Castillo | Tarjeta de contacto — CastleXpert',
    description:
      'Tarjeta digital de Deiby Castillo, Founder & CEO de CastleXpert. Guarda correo, WhatsApp y sitio web en un toque.',
    keywords: 'Deiby Castillo, CastleXpert, tarjeta de contacto, vCard, Costa Rica',
  },
  en: {
    title: 'Deiby Castillo | Contact card — CastleXpert',
    description:
      'Digital card for Deiby Castillo, Founder & CEO at CastleXpert. Save email, WhatsApp, and website in one tap.',
    keywords: 'Deiby Castillo, CastleXpert, contact card, vCard, Costa Rica',
  },
};

export function seoForPath(pathname: string, language: Language): PageSeo {
  const p = pathname.toLowerCase();
  if (p === '/mapa-del-sitio') return seoSiteMapByLang[language];
  if (p === '/acerca-de') return seoAboutByLang[language];
  if (p === '/castlexpertcard' || p === '/castlexpert-card') return seoContactCardByLang[language];
  return seoByLang[language];
}

export function canonicalPath(pathname: string): string {
  if (pathname === '/' || pathname === '') return '';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}
