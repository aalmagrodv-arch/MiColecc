// sw.js
const CACHE_NAME = 'mi-coleccion-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './libs/xlsx.full.min.js'
];

// Instalar: precache básico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first para assets estáticos
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Solo GET
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).then((res) => {
        // Guarda en cache si viene bien
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => cached);
    })
  );
});
