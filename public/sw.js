const CACHE_NAME = 'gempa-offline-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/peta',
    '/panduan',
    '/sos'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
    // Only cache GET requests
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            return cached || fetch(e.request).then(res => {
                // Dynamically cache visited requests
                if (e.request.url.startsWith('http') && !e.request.url.includes('api.allorigins.win')) {
                    const resClone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
                }
                return res;
            }).catch(() => {
                // Offline fallback logic
                if (e.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
