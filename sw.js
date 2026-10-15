// Offline support: keeps the app available without a connection and picks up new versions automatically (the cache name carries the version).
const VERSION = "3.23.1";
const CACHE = "cardvault-shell-" + VERSION;
const SHELL = ["./","assets/2023sv-cyE0V8cj.png","assets/2024sv-Ci1yPIhU.png","assets/index-C_M2ijd_.js","assets/index-DrBQ7g77.css","assets/worker-CnKSM9CP.js","engine/cardvault.zip","engine/pyodide/certifi-2024.12.14-py3-none-any.whl","engine/pyodide/cffi-1.17.1-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/charset_normalizer-3.3.2-py3-none-any.whl","engine/pyodide/cryptography-42.0.5-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/fonttools-4.51.0-py3-none-any.whl","engine/pyodide/idna-3.7-py3-none-any.whl","engine/pyodide/openssl-1.1.1w.zip","engine/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/pycparser-2.22-py3-none-any.whl","engine/pyodide/pyodide-lock.json","engine/pyodide/pyodide.asm.js","engine/pyodide/pyodide.asm.wasm","engine/pyodide/pyodide.js","engine/pyodide/pyodide.mjs","engine/pyodide/python_stdlib.zip","engine/pyodide/requests-2.31.0-py3-none-any.whl","engine/pyodide/six-1.16.0-py2.py3-none-any.whl","engine/pyodide/sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/ssl-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/urllib3-2.2.3-py3-none-any.whl","engine/wheels/defusedxml-0.7.1-py2.py3-none-any.whl","engine/wheels/et_xmlfile-2.0.0-py3-none-any.whl","engine/wheels/fpdf2-2.8.9-py3-none-any.whl","engine/wheels/openpyxl-3.1.5-py2.py3-none-any.whl","engine/wheels/pyodide_http-0.2.2-py3-none-any.whl","engine/wheels.json","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","manifest.webmanifest"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("cardvault-shell-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// ---- update notifications: a new version is announced even when the app isn't open (where the browser allows background checks)
const newer = (a, b) => { const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
async function checkForUpdate() {
  try {
    const r = await fetch("version.json?ts=" + Date.now(), { cache: "no-store" });
    const v = await r.json();
    if (newer(v.version, VERSION) && self.Notification && Notification.permission === "granted") {
      await self.registration.showNotification("Collect Em All " + v.version + " is ready", { body: (v.notes || "A new version is available.").slice(0, 140), tag: "cv-update",
        icon: "icons/icon-192.png", actions: [{ action: "refresh", title: "Refresh now" }, { action: "later", title: "Later" }], data: { version: v.version } });
    }
  } catch (err) { /* offline: try again next time */ }
}
self.addEventListener("periodicsync", (e) => { if (e.tag === "cv-update") e.waitUntil(checkForUpdate()); });
self.addEventListener("message", (e) => { if (e.data && e.data.type === "check") e.waitUntil(checkForUpdate()); if (e.data && e.data.type === "skip") self.skipWaiting(); });
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "later") return;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (list) => {
    const c = list[0] || (await self.clients.openWindow("./"));
    if (c) { c.postMessage({ type: "refresh" }); if (c.focus) c.focus(); }
  }));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;       // GitHub / picture servers: straight to the network
  const page = e.request.mode === "navigate" || url.pathname.endsWith("/version.json") || url.pathname.endsWith("/index.html");
  const store = (r) => { if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; };
  if (page) {                                                                       // the page itself: network first so a new version shows up at once
    e.respondWith(fetch(e.request).then(store).catch(() => caches.match(e.request).then((m) => m || caches.match("index.html"))));
  } else {                                                                          // everything else is versioned (hashed names / this cache's version): straight from the cache, fetched once
    e.respondWith(caches.match(e.request).then((m) => m || fetch(e.request).then(store)));
  }
});
