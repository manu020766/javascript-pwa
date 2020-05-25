var staticCacheName = 'static-cache-v2'
var dynamicCacheName = 'dynamic-cache-v2'
var urlsToCache = [
  '/',
  '/index.html',
  '/pages/fallback.html',
  // '/pages/about.html',
  // '/pages/contact.html',
  '/css/materialize.min.css',
  '/css/styles.css',
  '/js/materialize.min.js',
  '/js/ui.js',
  '/img/dish.webp',
  'favicon.ico',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/js/app.js',
  '/manifest.json',
  '/sw.js',
  '/img/icons/icon-72x72.png',
  '/img/icons/icon-96x96.png',
  '/img/icons/icon-128x128.png',
  '/img/icons/icon-144x144.png',
  '/img/icons/icon-152x152.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-384x384.png',
  '/img/icons/icon-512x512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== staticCacheName && key !== dynamicCacheName)
              .map(key => caches.delete(key))
        )
    })
  )
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(event.request.url, fetchRes.clone())
          return fetchRes
        })
      })
    }).catch(() => {
      console.log(event.request.url)
      console.log(event.request.url.indexOf('html') > -1)
      if (event.request.url.indexOf('html') > -1) {
        return caches.match('/pages/fallback.html')
      }
    })
  )
})
