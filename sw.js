const CACHE_NAME = 'bristol-v7'; // Yenilendiği anlaşılsın diye v7 yaptık

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

// Dosya çağırma (Fetch) - AĞ ÖNCELİKLİ (Network First) STRATEJİ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Önce internetten en güncel dosyayı çekmeyi dene
    fetch(event.request)
      .then((networkResponse) => {
        // Eğer internet varsa ve başarılıysa, bu yeni dosyayı önbelleğe de kopyala
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Eğer internet yoksa (Çevrimdışıysa), önbellekteki dosyayı göster
        return caches.match(event.request);
      })
  );
});
