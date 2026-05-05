type PublicApiConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
};

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

/**
 * Base URL del servidor Express (`npm run start`) para rutas `/api/*` (chat, contacto, handoff).
 * Si está vacío, se usan rutas relativas (mismo origen: Vite dev con proxy o sitio servido por el mismo Node).
 * Si el frontend está en otro host (p. ej. Cloudflare Pages), define `VITE_PUBLIC_API_URL` en el build
 * con la URL pública de Railway, p. ej. `https://tu-app.up.railway.app`.
 */
export function getExpressApiBaseUrl(): string {
  const explicit = import.meta.env.VITE_PUBLIC_API_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);
  return '';
}

export function getPublicApi(): PublicApiConfig {
  const explicit = import.meta.env.VITE_PUBLIC_API_URL?.trim();
  if (explicit) return { baseUrl: stripTrailingSlash(explicit) };

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (supabaseUrl && supabaseAnon) {
    return {
      baseUrl: `${stripTrailingSlash(supabaseUrl)}/functions/v1`,
      headers: {
        apikey: supabaseAnon,
        Authorization: `Bearer ${supabaseAnon}`,
      },
    };
  }

  const admin = import.meta.env.VITE_ADMIN_URL?.trim();
  if (admin) return { baseUrl: stripTrailingSlash(admin) };

  return { baseUrl: '' };
}

