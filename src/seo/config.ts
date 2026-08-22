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

export const seoMockupsByLang: Record<Language, PageSeo> = {
  es: {
    title: 'Repositorio de mockups | CastleXpert',
    description:
      'Presentaciones interactivas CastleXpert: CMMS con inventario, Logistic Internacional y ERP Inventario.',
    keywords: 'mockups CastleXpert, presentación CMMS inventario, Logistic Internacional, ERP Inventario, Costa Rica',
  },
  en: {
    title: 'Mockup repository | CastleXpert',
    description: 'CastleXpert interactive presentations: CMMS with inventory, Logistic Internacional, and ERP Inventory.',
    keywords: 'CastleXpert mockups, CMMS inventory presentation, Logistic Internacional, ERP Inventory, Costa Rica',
  },
};

export const seoAboutByLang: Record<Language, PageSeo> = {
  es: {
    title: 'Acerca de CastleXpert | Quiénes somos',
    description:
      'Más de dos décadas modernizando sistemas empresariales: Oracle, apps a medida, arquitectura digital y migración a web moderna desde Costa Rica.',
    keywords: 'CastleXpert, acerca de, Oracle, migración, apps, arquitectura digital, Costa Rica',
  },
  en: {
    title: 'About CastleXpert | Who we are',
    description:
      'More than two decades modernizing business systems: Oracle, custom apps, digital architecture, and migration to modern web — from Costa Rica.',
    keywords: 'CastleXpert, about, Oracle, migration, apps, digital architecture, Costa Rica',
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

export const seoContactByLang: Record<Language, PageSeo> = {
  es: {
    title: 'Contacto | CastleXpert — WhatsApp y formulario',
    description:
      'Contacta a CastleXpert por WhatsApp o formulario. Cotizaciones, apps a medida y arquitectura digital en Costa Rica.',
    keywords: 'CastleXpert contacto, WhatsApp CastleXpert, cotizar app Costa Rica, formulario contacto',
  },
  en: {
    title: 'Contact | CastleXpert — WhatsApp and form',
    description:
      'Reach CastleXpert via WhatsApp or contact form. Quotes, custom apps, and digital architecture from Costa Rica.',
    keywords: 'CastleXpert contact, WhatsApp CastleXpert, app quote Costa Rica, contact form',
  },
};

const seoDemoById: Record<string, Record<Language, PageSeo>> = {
  tracklogic: {
    es: {
      title: 'Demo TrackLogic | CastleXpert',
      description:
        'Demo funcional TrackLogic: Tracklogistic Manager, Tracklogistic y Tracklogistic Logic para paquetería EE.UU. → Costa Rica.',
      keywords: 'TrackLogic, Tracklogistic, Tracklogistic Manager, Tracklogistic Logic, demo paquetería, CastleXpert, Costa Rica',
    },
    en: {
      title: 'TrackLogic Demo | CastleXpert',
      description:
        'Functional TrackLogic demo: Tracklogistic Manager, Tracklogistic, and Tracklogistic Logic for US → Costa Rica parcel tracking.',
      keywords: 'TrackLogic, Tracklogistic, Tracklogistic Manager, Tracklogistic Logic, parcel tracking demo, CastleXpert, Costa Rica',
    },
  },
  foodly: {
    es: {
      title: 'Demo Foodly | CastleXpert',
      description:
        'Demo Foodly: ecosistema de restaurante con Foodly, Foodly Manager y APK Foodly-rest para cocina y delivery.',
      keywords: 'Foodly, Foodly Manager, Foodly-rest, demo restaurante, CastleXpert, Costa Rica',
    },
    en: {
      title: 'Foodly Demo | CastleXpert',
      description:
        'Foodly demo: restaurant ecosystem with Foodly, Foodly Manager, and Foodly-rest APK for kitchen and delivery.',
      keywords: 'Foodly, Foodly Manager, Foodly-rest, restaurant demo, CastleXpert, Costa Rica',
    },
  },
  cmms: {
    es: {
      title: 'Demo CMMS MANTE Preventivo | CastleXpert',
      description:
        'Demo CMMS CastleXpert: mantenimiento preventivo con Web Manager, técnicos, QR y WhatsApp.',
      keywords: 'CMMS, MANTE Preventivo, mantenimiento preventivo, CastleXpert, Costa Rica',
    },
    en: {
      title: 'CMMS MANTE Preventive Demo | CastleXpert',
      description:
        'CastleXpert CMMS demo: preventive maintenance with Web Manager, techs, QR, and WhatsApp.',
      keywords: 'CMMS, MANTE Preventive, maintenance demo, CastleXpert, Costa Rica',
    },
  },
  'pura-puntos': {
    es: {
      title: 'Demo Pura Puntos | CastleXpert',
      description:
        'Demo Pura Puntos: lealtad multi-comercio con Pura Puntos, Pura Puntos Cash y Pura Puntos Manager.',
      keywords: 'Pura Puntos, lealtad, loyalty, Pura Puntos Cash, Pura Puntos Manager, CastleXpert, Costa Rica',
    },
    en: {
      title: 'Pura Puntos Demo | CastleXpert',
      description:
        'Pura Puntos demo: multi-merchant loyalty with Pura Puntos, Pura Puntos Cash, and Pura Puntos Manager.',
      keywords: 'Pura Puntos, loyalty, Pura Puntos Cash, Pura Puntos Manager, CastleXpert, Costa Rica',
    },
  },
};

export const seoOracleMigrationByLang: Record<Language, PageSeo> = {
  es: {
    title: 'Migración Oracle Developer a web moderna | CastleXpert',
    description:
      'Migración de Oracle Forms 6i–14c a React, Vite, Node.js y API REST. Evaluación de modernización, entrega incremental y códigos fuente.',
    keywords: 'migración Oracle Forms, Oracle Developer, React, Node.js, Vite, API REST, CastleXpert, Costa Rica',
  },
  en: {
    title: 'Oracle Developer migration to modern web | CastleXpert',
    description:
      'Migrate Oracle Forms 6i–14c to React, Vite, Node.js, and REST APIs. Modernization assessment, incremental delivery, and source code.',
    keywords: 'Oracle Forms migration, Oracle Developer, React, Node.js, Vite, REST API, CastleXpert, Costa Rica',
  },
};

export function seoForPath(pathname: string, language: Language): PageSeo {
  const p = pathname.toLowerCase();
  if (p === '/mapa-del-sitio') return seoSiteMapByLang[language];
  if (p === '/acerca-de') return seoAboutByLang[language];
  if (p === '/contacto' || p === '/contact') return seoContactByLang[language];
  if (p === '/castlexpertcard' || p === '/castlexpert-card') return seoContactCardByLang[language];
  if (p === '/servicios/migracion-oracle') return seoOracleMigrationByLang[language];
  const demoMatch = p.match(/^\/demos\/(tracklogic|foodly|cmms|pura-puntos)\/?$/);
  if (demoMatch) return seoDemoById[demoMatch[1]][language];
  if (p === '/mockups' || p.startsWith('/mockups/')) return seoMockupsByLang[language];
  return seoByLang[language];
}

export function canonicalPath(pathname: string): string {
  if (pathname === '/' || pathname === '') return '';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}
