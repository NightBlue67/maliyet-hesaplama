const CACHE_NAME = 'bristol-v5';

const ASSETS = [
  './',
  './index.html',
  './apple-touch-icon.png',
  './manifest.json'
];

// Kurulum (Install)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
  );

  // Yeni service worker'ı hemen aktif et
  self.skipWaiting();
});

// Aktivasyon (Eski cache temizleme)
self.addEventListener('activate', (event) => {
  event.waitUntil(

    caches.keys().then((cacheNames) => {

      return Promise.all(

        cacheNames.map((cache) => {

          // Eski cache'leri sil
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }

        })

      );

    })

  );

  // Açık sekmelerde hemen aktif olsun
  self.clients.claim();
});

// Dosya çağırma (Fetch)
self.addEventListener('fetch', (event) => {

  event.respondWith(

    caches.match(event.request)
      .then((cachedResponse) => {

        // Cache varsa onu aç
        if (cachedResponse) {
          return cachedResponse;
        }

        // Yoksa internetten çek
        return fetch(event.request);

      })

  );

});
