// Service worker minimo: mette in cache la app (un solo file HTML, niente
// backend) così dopo la prima apertura funziona anche senza rete — utile
// in salita, dove il segnale è spesso il primo a mancare.
const CACHE_NAME = 'carbo-bike-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// cache-first con fallback di rete: se esce una nuova versione la si
// riprende al riavvio successivo (aggiornamento del CACHE_NAME).
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
