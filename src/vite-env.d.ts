/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_URL?: string;
  /** Base URL del API Express (chat, contacto, handoff). Mismo origen si vacío; p. ej. `https://xxx.up.railway.app` si el front está en otro host. */
  readonly VITE_PUBLIC_API_URL?: string;
  /** URL canónica del sitio para SEO (meta, JSON-LD, sitemap). Ej. `https://castlexpert.com` */
  readonly VITE_SITE_URL?: string;
}
