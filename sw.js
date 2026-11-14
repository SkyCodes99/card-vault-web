// Offline support: keeps the app available without a connection and picks up new versions automatically (the cache name carries the version).
const VERSION = "3.50.132";
const CACHE = "cardvault-shell-" + VERSION;
const SHELL = ["./","assets/2023sv-cyE0V8cj.png","assets/2024sv-Ci1yPIhU.png","assets/AddCardBody-4opMi2y7.js","assets/AlertsBody-OL1AnBh2.js","assets/AvatarEditor-B5aVBwWm.js","assets/BulkEditPanel-BKMP95XO.js","assets/CardPicker-Ba_G81nk.js","assets/ComicBits-CeKXeR30.js","assets/Compare-DMZSua8f.js","assets/CustomItem-DNjeWbrL.js","assets/de-Dv7-0Jq9.js","assets/Decks-COmlpOjF.js","assets/Dev-BhqQrlHV.js","assets/DevChanges-B8a6qr4e.js","assets/en.sold-DgvGn6xS.js","assets/es-6wn1Ait8.js","assets/fr-DR5uhezp.js","assets/FriendsPage-Drt94j6T.js","assets/GameLinks-CsmIoXNh.js","assets/Games-BIi8tWjp.js","assets/GetApp-CIBNI6iy.js","assets/GradedPop-ZMhUSG4C.js","assets/Grading-BiVSMW8N.js","assets/GradingSend-TuwpdW3k.js","assets/History-Cxlj7fzl.js","assets/ImportList-CXt1jUOd.js","assets/ImportList-_rZXPWl2.css","assets/ImportModal-TfZ4FNsO.js","assets/index-axRqFVqW.css","assets/index-CI33tUKy.js","assets/index-D3Mz4UNV.js","assets/Insights-CMWr6bO7.js","assets/InsuranceReport-fLGY9sLj.js","assets/Inventory-Bj4NLCu0.js","assets/it-DPA2sI-2.js","assets/ja-C-lO3Z1L.js","assets/keptApi-BP9uw5oL.js","assets/LanguageCard-BRaCBWAy.js","assets/LanguageCard-B_tjDLIN.css","assets/Legal-Dzw5EIRP.js","assets/MarketIndexBody-C6qtQOWw.js","assets/MarketIndexBody-CzEobZ1V.css","assets/MarkSold-CBInnthT.js","assets/MasterSet-rUJSu1p8.js","assets/MissingModal-Bj4Vh-1W.js","assets/numjudge-Bz2CuLyF.js","assets/numread-LDdNk7ws.js","assets/Organize-BtQ3IFuY.js","assets/OrganizeExtras--wnkK-n7.js","assets/Overview-DEspEpX5.js","assets/PhoneSettings-CGyGVX4N.js","assets/Plan-CwWKsWVb.js","assets/PortfolioManager-kmLo679A.js","assets/PriceDetail-DWFUzEWC.js","assets/PriceWatch-dUrtg4cJ.js","assets/PriceWatchBody-B-lCl1cd.js","assets/ProfitLoss-BJF3R5_M.js","assets/pt-DEDdyA4_.js","assets/Races-ByranHCN.js","assets/ReleaseCalendar-DruDYCLE.js","assets/Scanner-C008ocAG.js","assets/SealedPage-PopTTeiJ.js","assets/SearchAll-BBuhpP7O.js","assets/Settings-BK156o1V.js","assets/ShareHub-BgRIPRyD.js","assets/ShareLock-Dlsl_3at.js","assets/SoldHistory-CiGKBPeD.js","assets/Trade-DNgDxUrY.js","assets/tradeMath-yFXzdxpa.js","assets/useOpenResult-NBG2YwQe.js","assets/WhatsNew-DrcX-3O5.js","assets/Wishlist-J2xrpyZB.js","assets/worker-CsEJSzbL.js","engine/cardvault.zip","engine/pyodide/certifi-2024.12.14-py3-none-any.whl","engine/pyodide/cffi-1.17.1-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/charset_normalizer-3.3.2-py3-none-any.whl","engine/pyodide/cryptography-42.0.5-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/fonttools-4.51.0-py3-none-any.whl","engine/pyodide/idna-3.7-py3-none-any.whl","engine/pyodide/openssl-1.1.1w.zip","engine/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/pycparser-2.22-py3-none-any.whl","engine/pyodide/pyodide-lock.json","engine/pyodide/pyodide.asm.js","engine/pyodide/pyodide.asm.wasm","engine/pyodide/pyodide.js","engine/pyodide/pyodide.mjs","engine/pyodide/python_stdlib.zip","engine/pyodide/requests-2.31.0-py3-none-any.whl","engine/pyodide/six-1.16.0-py2.py3-none-any.whl","engine/pyodide/sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/ssl-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/urllib3-2.2.3-py3-none-any.whl","engine/wheels/defusedxml-0.7.1-py2.py3-none-any.whl","engine/wheels/et_xmlfile-2.0.0-py3-none-any.whl","engine/wheels/fpdf2-2.9.0-py3-none-any.whl","engine/wheels/openpyxl-3.1.5-py2.py3-none-any.whl","engine/wheels/pyodide_http-0.2.2-py3-none-any.whl","engine/wheels.json","icons/apple-touch-icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-192.png","icons/icon-maskable-512.png","index.html","legal/credits.html","legal/delete-account.html","legal/index.html","legal/privacy.html","legal/terms.html","manifest.webmanifest"];
const ENGINE = "cardvault-engine-5fb7ee4a0f";
const isEngine = (u) => u.indexOf("engine/pyodide/") >= 0;
// the few app-specific files that keep the SAME name in every version are fetched past the browser's own cache (it may keep them for a day); the big unchanging engine parts are not re-downloaded
const fresh = (u) => u.includes("engine/cardvault.zip") || u.includes("engine/wheels.json") || u.includes("manifest.webmanifest") || u === "./";
self.addEventListener("install", (e) => { e.waitUntil(Promise.all([caches.open(CACHE), caches.open(ENGINE)]).then(([c, eng]) => Promise.all(SHELL.map(async (u) => { if (isEngine(u)) { if (!(await eng.match(u))) await eng.add(u); return; } await c.add(new Request(u, fresh(u) ? { cache: "reload" } : {})); })))); });          // a new version WAITS until the person presses Refresh (or closes every tab): taking over by itself used to reload the page under them mid-work
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => (k.startsWith("cardvault-shell-") && k !== CACHE) || (k.startsWith("cardvault-engine-") && k !== ENGINE)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
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
self.addEventListener("message", (e) => { if (e.data && e.data.type === "check") e.waitUntil(checkForUpdate()); if (e.data && e.data.type === "skip") self.skipWaiting();
  // the page asking is already this version: take over quietly - but only when it is the only window, so another tab still on an older copy keeps the files it needs
  if (e.data && e.data.type === "skip-if-alone") e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => { if (list.length <= 1) return self.skipWaiting(); })); });
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "later") return;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (list) => {
    const c = list[0] || (await self.clients.openWindow("./"));
    if (c) { c.postMessage({ type: "refresh" }); if (c.focus) c.focus(); }
  }));
});
// Signing in: the browser's own (native) PBKDF2, answering the engine's synchronous request - the engine's WebAssembly maths for the same thing takes many seconds on a phone
self.addEventListener("fetch", (e) => {
  const u0 = new URL(e.request.url);
  if (e.request.method === "POST" && u0.origin === location.origin && u0.pathname.endsWith("/__pbkdf2")) {
    e.respondWith((async () => {
      const bad = () => new Response(JSON.stringify({ ok: false }), { headers: { "Content-Type": "application/json" } });
      try {
        const j = await e.request.json(), un = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
        const key = await crypto.subtle.importKey("raw", un(j.pw), "PBKDF2", false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: un(j.salt), iterations: Math.min(2000000, Math.max(1, j.iter | 0)) }, key, 256);
        return new Response(JSON.stringify({ ok: true, key: btoa(String.fromCharCode(...new Uint8Array(bits))) }), { headers: { "Content-Type": "application/json" } });
      } catch (err) { return bad(); }
    })());
    return;
  }
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;       // GitHub / picture servers: straight to the network
  const page = e.request.mode === "navigate" || url.pathname.endsWith("/version.json") || url.pathname.endsWith("/index.html");
  const store = (r) => { if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; };
  if (page) {                                                                       // the page itself: network first, past the browser's own cache, so every start loads the NEWEST version
    let req = e.request; try { req = new Request(e.request, { cache: "no-cache" }); } catch (err) { /* this browser can't: the plain request */ }
    e.respondWith(fetch(req).then(store).catch(() => caches.open(CACHE).then((c) => c.match(e.request).then((m) => m || c.match("index.html")))));
  } else {                                                                          // everything else is versioned (hashed names / this cache's version): straight from the cache, fetched once
    e.respondWith(caches.open(isEngine(url.pathname) ? ENGINE : CACHE).then((c) => c.match(e.request)).then((m) => m || fetch(e.request).then((r) => { if (r && r.ok) { const copy = r.clone(); caches.open(isEngine(url.pathname) ? ENGINE : CACHE).then((c) => c.put(e.request, copy)); } return r; })));           // ONLY this version's own cache: an older copy's files (the engine!) must never be served to a newer page
  }
});
