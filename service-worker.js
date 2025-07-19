self.addEventListener("install", (e) => {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open("eano-cache-v1").then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/manifest.json",
        "/firebase.js",
        "/assets/logo.png",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
