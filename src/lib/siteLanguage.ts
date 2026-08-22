/** Persistencia del idioma del sitio (SPA + páginas estáticas). */
export type SiteLanguage = 'es' | 'en';

export const SITE_LANG_KEY = 'cx-lang';

export function readStoredLanguage(): SiteLanguage {
  try {
    const v = localStorage.getItem(SITE_LANG_KEY);
    return v === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

export function storeLanguage(lang: SiteLanguage) {
  try {
    localStorage.setItem(SITE_LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function oracleMigrationUrl(lang: SiteLanguage) {
  return lang === 'en' ? '/servicios/migracion-oracle/?lang=en' : '/servicios/migracion-oracle/';
}
