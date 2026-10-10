// Service worker: keeps the app shell available offline and picks up new versions automatically (the cache name carries the version).
const VERSION = "2.4.0";
const CACHE = "cardvault-shell-" + VERSION;
const SHELL = ["./", "index.html", "style.css", "manifest.webmanifest", "js/app.js", "js/merge.js", "js/github.js", "js/store.js", "js/version.js",
  "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("cardvault-shell-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;       // GitHub / picture servers: straight to the network
  e.respondWith(fetch(e.request).then((r) => {                                    // network first so a new version shows up at once, cache as fallback
    const copy = r.clone();
    caches.open(CACHE).then((c) => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request).then((m) => m || caches.match("index.html"))));
});
