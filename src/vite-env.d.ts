/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_URL?: string;
  /** Base URL del API Node (SQLite), p. ej. http://localhost:8788 */
  readonly VITE_PUBLIC_API_URL?: string;
}
