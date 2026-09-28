const CACHE = 'yasin-gold-art-v2';
const SHELL = ['/yasin-gold-art/', '/yasin-gold-art/icon.svg', '/yasin-gold-art/hero-ring.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then(response => response || caches.match('/yasin-gold-art/'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request).then(network => {
    if (network.ok && ['style', 'script', 'image', 'font'].includes(event.request.destination)) {
      const copy = network.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return network;
  })));
});
