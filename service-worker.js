var cacheName = 'TodoApp1.1';
var filesToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/main.css',
  '/close.svg'
];

self.addEventListener('install', function(e) {
  console.log('Service Worker Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Sw] Caching app shell!');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if(key !== cacheName) {
          console.log('[Sw] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Sw] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  )
});