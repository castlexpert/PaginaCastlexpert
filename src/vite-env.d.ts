/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_URL?: string;
  /** Base URL del API Express (chat, contacto, handoff). Mismo origen si vacío; p. ej. `https://xxx.up.railway.app` si el front está en otro host. */
  readonly VITE_PUBLIC_API_URL?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
}
