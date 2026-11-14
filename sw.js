// Offline support: keeps the app available without a connection and picks up new versions automatically (the cache name carries the version).
const VERSION = "3.50.134";
const CACHE = "cardvault-shell-" + VERSION;
const SHELL = ["./","assets/2023sv-cyE0V8cj.png","assets/2024sv-Ci1yPIhU.png","assets/AddCardBody-Cv_1PWGz.js","assets/AlertsBody-DC9zCcwS.js","assets/AvatarEditor-Bpv3FiKX.js","assets/BulkEditPanel-8LXBebjI.js","assets/CardPicker-ROsaKZAC.js","assets/ComicBits-DmXHyOH3.js","assets/Compare-DGLtN0_4.js","assets/CustomItem-DthPI7vZ.js","assets/de-BuBBJLLs.js","assets/Decks-DC8BST8m.js","assets/Dev-gRG2Ypvo.js","assets/DevChanges-G9Kv3hAw.js","assets/en.sold-ClnJV3Ap.js","assets/es-CYHA5kdy.js","assets/fr-CViSJ7kX.js","assets/FriendsPage-CQ47vkYu.js","assets/GameLinks-COPm5brM.js","assets/Games-DeqXj8-3.js","assets/GetApp-6ImNZtpN.js","assets/GradedPop-CEH6k3qh.js","assets/Grading-DLxzfO3M.js","assets/GradingSend-BuSgOOnm.js","assets/History-Bxx_5Kzt.js","assets/ImportList-DFBSlgiM.js","assets/ImportList-_rZXPWl2.css","assets/ImportModal-CBJWEy8Z.js","assets/index-BK8kcT46.js","assets/index-Cusqv5Ya.css","assets/index-D3Mz4UNV.js","assets/Insights-CdzpGhmm.js","assets/InsuranceReport-D6cvKhLU.js","assets/Inventory-DSd08Gzq.js","assets/it-BZonRzoE.js","assets/ja-gGm4UN0f.js","assets/keptApi-C3lV8-oK.js","assets/LanguageCard-B_tjDLIN.css","assets/LanguageCard-CB8UkbyU.js","assets/Legal-hxzhaHtZ.js","assets/MarketIndexBody-BxLonOeL.js","assets/MarketIndexBody-CzEobZ1V.css","assets/MarkSold-CgbzoQwF.js","assets/MasterSet-DSttzr1Y.js","assets/MissingModal-BuipjXEI.js","assets/numjudge-Bz2CuLyF.js","assets/numread-Bpsd0HFZ.js","assets/Organize-BI41e-Xd.js","assets/OrganizeExtras-Cpz0dSCL.js","assets/Overview-zOULNI3_.js","assets/PhoneSettings-DmGDdCtV.js","assets/Plan-CqNdedX6.js","assets/PortfolioManager-p1ZCKF1S.js","assets/PriceDetail-DWiwbCrx.js","assets/PriceWatch-CSmrpcZy.js","assets/PriceWatchBody-DcN2GEHA.js","assets/ProfitLoss-BuLBC3e0.js","assets/pt-BkwpZBPy.js","assets/Races-CyCowo2y.js","assets/ReleaseCalendar-B0kj15aa.js","assets/Scanner-CqA0-5Yk.js","assets/SealedPage-g82o0dpl.js","assets/SearchAll-DIdPbz1J.js","assets/Settings-CFTX4-9W.js","assets/ShareHub-BIAtx-05.js","assets/ShareLock-Css62cQo.js","assets/SoldHistory-zcc58b9H.js","assets/Trade-CCzyihl8.js","assets/tradeMath-eYsQbcuz.js","assets/useOpenResult-D9KEIldL.js","assets/WhatsNew-BNuDFbTf.js","assets/Wishlist-V_ZVhi_8.js","assets/worker-BQ8J1iup.js","engine/cardvault.zip","engine/pyodide/certifi-2024.12.14-py3-none-any.whl","engine/pyodide/cffi-1.17.1-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/charset_normalizer-3.3.2-py3-none-any.whl","engine/pyodide/cryptography-42.0.5-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/fonttools-4.51.0-py3-none-any.whl","engine/pyodide/idna-3.7-py3-none-any.whl","engine/pyodide/openssl-1.1.1w.zip","engine/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/pycparser-2.22-py3-none-any.whl","engine/pyodide/pyodide-lock.json","engine/pyodide/pyodide.asm.js","engine/pyodide/pyodide.asm.wasm","engine/pyodide/pyodide.js","engine/pyodide/pyodide.mjs","engine/pyodide/python_stdlib.zip","engine/pyodide/requests-2.31.0-py3-none-any.whl","engine/pyodide/six-1.16.0-py2.py3-none-any.whl","engine/pyodide/sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/ssl-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/urllib3-2.2.3-py3-none-any.whl","engine/wheels/defusedxml-0.7.1-py2.py3-none-any.whl","engine/wheels/et_xmlfile-2.0.0-py3-none-any.whl","engine/wheels/fpdf2-2.9.0-py3-none-any.whl","engine/wheels/openpyxl-3.1.5-py2.py3-none-any.whl","engine/wheels/pyodide_http-0.2.2-py3-none-any.whl","engine/wheels.json","icons/apple-touch-icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-192.png","icons/icon-maskable-512.png","index.html","legal/credits.html","legal/delete-account.html","legal/index.html","legal/privacy.html","legal/terms.html","manifest.webmanifest"];
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
