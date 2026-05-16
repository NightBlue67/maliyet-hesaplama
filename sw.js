const CACHE_NAME = 'bristol-v1';
const ASSETS = [
  'index.html',
  'apple-touch-icon.png',
  'manifest.json'
];

// Dosyaları telefona yükleme (Cache)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// İnternet yoksa telefondaki dosyaları açma
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
