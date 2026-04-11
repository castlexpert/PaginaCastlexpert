import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getFirebaseApp, initFirebaseAnalytics } from './lib/firebase';

if (import.meta.env.DEV && !getFirebaseApp()) {
  console.info(
    '[Firebase] Define VITE_FIREBASE_* en .env o .env.local para inicializar el SDK.'
  );
}

void initFirebaseAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
