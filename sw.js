// Bump the version whenever the cached file list changes.
const CACHE_NAME = "money-please-v2"

const APP_SHELL = [
    "./",
    "./index.html",
    "./styles.css",
    "./index.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-maskable-512.png"
]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    )
})

// Network first for the app's own files, falling back to the cache when offline.
// Cross-origin requests (the Cloudflare worker API) are left alone so costs are never stale.
self.addEventListener("fetch", (event) => {
    const request = event.request
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
        return
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    const copy = response.clone()
                    caches.open(CACHE_NAME).then(cache => cache.put(request, copy))
                }
                return response
            })
            .catch(() => caches.match(request))
    )
})
