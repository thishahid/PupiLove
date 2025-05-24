// Simple service worker for offline support
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pupilove-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './index.js',
        './manifest.json',
        // Add icons if available
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
