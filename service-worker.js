self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("finansi-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style/main.css",
        "./js/app.js",
        "./manifest.json",
        "./icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
