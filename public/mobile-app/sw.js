const CACHE_NAME = 'home-food-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/mobile-app/manifest.webmanifest',
    '/mobile-app/app_icon_192.png',
    '/mobile-app/app_icon_512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
