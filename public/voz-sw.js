/* Minimal SW so Android/Windows can install the Penélope PWA. */
const CACHE = 'cx-voz-v1';
const ASSETS = ['/voz', '/voz-manifest.webmanifest', '/castlexpert-logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request).catch(() => caches.match('/voz')))
  );
});
