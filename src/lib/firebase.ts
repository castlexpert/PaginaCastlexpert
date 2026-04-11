import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

let appInstance: FirebaseApp | undefined;

/** App de Firebase; undefined si faltan variables en `.env` / `.env.local`. */
export function getFirebaseApp(): FirebaseApp | undefined {
  if (!isFirebaseConfigured()) return undefined;
  if (!appInstance) {
    appInstance = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return appInstance;
}

/** Analytics solo en navegadores compatibles y con `measurementId`. */
export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  const app = getFirebaseApp();
  if (!app || !firebaseConfig.measurementId) return null;
  if (!(await isSupported())) return null;
  return getAnalytics(app);
}
