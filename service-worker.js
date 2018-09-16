'use strict';

var cacheName = 'TodoApp1.3';
var filesToCache = ['/', '/index.html', '/main.js', '/main.css', '/close.svg'];

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
      return Promise.all(
        keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('[Sw] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
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
  );
});

self.addEventListener('push', function(e) {
  const title = "Msg from TODO";
  const options = {
    body: e.data.text(),
    icon: 'icon.png',
    badge: 'icon.png',
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  //e.waitUntil(clients.openWindow('http://127.0.0.1:8887'));
  e.waitUntil(clients.openWindow('https://todo-pwa-5b853.firebaseapp.com/'));
});
