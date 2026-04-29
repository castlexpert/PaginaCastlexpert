type PublicApiConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
};

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
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

