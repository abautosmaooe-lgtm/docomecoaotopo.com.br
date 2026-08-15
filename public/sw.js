const CACHE_NAME = "comeco-ao-topo-v2";

// Install Service Worker
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate Service Worker & clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Interceptor: Network-first strategy for static production assets
self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  // Never intercept API routes, non-GET requests, or Vite dev files
  if (
    !url.startsWith(self.location.origin) ||
    event.request.method !== "GET" ||
    url.includes("/api/") ||
    url.includes("/src/") ||
    url.includes("/@vite") ||
    url.includes("/@fs") ||
    url.includes("/node_modules/") ||
    url.endsWith(".tsx") ||
    url.endsWith(".ts") ||
    url.endsWith(".jsx")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
