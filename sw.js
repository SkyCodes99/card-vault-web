// Offline support: keeps the app available without a connection and picks up new versions automatically.  Built from ui/build/sw.template.js by ui/build/pwa.js
// (the build puts this version's lists in CONFIG below).
//  - install keeps ONLY the app shell (the page, the first-screen script and style, icons, manifest); every other screen, language and the scanner is kept the first time it is used
//  - files with the content hash in their name (assets/) live in ONE cache shared by every version: an update fetches only the names that are new, and names no longer built are dropped
//  - the engine (engine/pyodide/) has a cache of its own, filled the first time the engine starts (never at install), and keeps only files whose SHA-256 matches this build
const CONFIG = {"version":"3.50.139","engineKey":"609f4c45e5","shell":["./","assets/index-DfLMIpGJ.js","assets/react-3sQq0HIT.js","assets/i18n-Bm8agGu5.js","assets/charts-OFbu3gW7.js","assets/engine-client-BGoX3hUL.js","assets/index-gNRR_lze.css","icons/apple-touch-icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-192.png","icons/icon-maskable-512.png","manifest.webmanifest"],"built":["assets/2023sv-cyE0V8cj.png","assets/2024sv-Ci1yPIhU.png","assets/AddCardBody-D8LdVf-v.js","assets/AlertsBody-e8PIH-gT.js","assets/AvatarEditor--O--nF3h.js","assets/BulkEditPanel-D9YuYxYa.js","assets/CardPicker-BKKYicGI.js","assets/ComicBits-WaGfLqhm.js","assets/Compare-DfmpIjtD.js","assets/CustomItem-p9BOmh5J.js","assets/Decks-B_-VLTsv.js","assets/Dev-BzPOxq8e.js","assets/Dev-CnKblFaM.css","assets/DevChanges-CNvuDJMU.js","assets/FriendsPage-BlKDxkYc.js","assets/GameLinks-DnQKsezs.js","assets/Games-_3p98DPp.js","assets/GetApp-3gm20Mxz.js","assets/GradedPop-DdOeK6Nm.js","assets/Grading-DeSgSpKa.js","assets/GradingSend-Cnjn35X9.js","assets/History-g8QT6Xmc.js","assets/ImportList-BzEAQ7pw.js","assets/ImportList-_rZXPWl2.css","assets/ImportModal-C6AbSQ7x.js","assets/Insights-DtKE27FA.js","assets/InsuranceReport-TpNrI09o.js","assets/Inventory-BJd1DJdZ.js","assets/KnownNote-vqhLjfO6.js","assets/LanguageCard-BU_2iWbd.js","assets/LanguageCard-DRNa-zUz.css","assets/Legal-BFUwy0lu.js","assets/MarkSold-riMsbYIw.js","assets/MarketIndexBody-Cb6BRtWB.js","assets/MarketIndexBody-CzEobZ1V.css","assets/MasterSet-BLKJsvLh.js","assets/MissingModal-C4EA613j.js","assets/MoveBridge-Cva2k99r.js","assets/MoveReview-gCYDL41a.js","assets/Organize-KbBWfz8b.js","assets/OrganizeExtras-oPJRQ-dz.js","assets/PackArts-Eo9OS-ui.js","assets/PageHead-fxheNuhy.js","assets/PhoneSettings-Cse9mJJb.js","assets/Plan-YV4upvJK.js","assets/PortfolioManager-Dm98W-zp.js","assets/PriceDetail-CxPmxS1d.js","assets/PriceWatch-B9yz_7pE.js","assets/PriceWatchBody-DTXH8fm_.js","assets/ProfitLoss-Bi89u7Ln.js","assets/Races-Ar3fQxTQ.js","assets/ReleaseCalendar-BCarfY7m.js","assets/Scanner-DHhllWlP.js","assets/SealedPage-CRSWlP9T.js","assets/Settings-BQY_DoIB.js","assets/ShareHub-ovL9fI5Y.js","assets/ShareLock-i9Om2ugh.js","assets/SignedFields-BmbEm-WC.js","assets/SoldHistory-Dclt-GDh.js","assets/Trade-DS1nl63n.js","assets/UnifyOffer-C6z5DYAI.js","assets/V2Note-BuXKcwDp.js","assets/Wishlist-DEOC6Qtu.css","assets/Wishlist-lwU4QODJ.js","assets/answers-DPtRf84K.js","assets/charts-OFbu3gW7.js","assets/de-CKwSE-bB.js","assets/en.sold-DCtDLOfL.js","assets/engine-client-BGoX3hUL.js","assets/es-B2HJNskA.js","assets/fr-3KucbQ2s.js","assets/i18n-Bm8agGu5.js","assets/index-D3Mz4UNV.js","assets/index-DfLMIpGJ.js","assets/index-gNRR_lze.css","assets/it-Dc2tseuS.js","assets/ja-BMZoDmtx.js","assets/numjudge-Bz2CuLyF.js","assets/numread-BxMDss9i.onnx","assets/numread-QzY02teS.js","assets/pt-4xxoOn8-.js","assets/react-3sQq0HIT.js","assets/routes-B7tGss9k.js","assets/scrypt-wZu5GT1L.js","assets/tradeMath-B_XOj6Cy.js","assets/v2-Bmgx28pN.js","assets/v2session-Czcp5Nrw.js","assets/v2signin-BQ5B0k_c.js","assets/worker-D0NCNVZh.js"],"sums":{"engine/pyodide/certifi-2024.12.14-py3-none-any.whl":"a5f31d8fbcd66632ba9fe6face6471c4d4df2e85cd6c46bd0c5ff58eb903a4ad","engine/pyodide/cffi-1.17.1-cp312-cp312-pyodide_2024_0_wasm32.whl":"3844b091b8da880622d16c428a545d6a2753dfc148240f1328019375e6f70868","engine/pyodide/charset_normalizer-3.3.2-py3-none-any.whl":"b83440eee4a1398f9a71186169cdc17b84cdb93a63e61f3c6347dd1463a11fca","engine/pyodide/cryptography-42.0.5-cp312-cp312-pyodide_2024_0_wasm32.whl":"c336f40273d92660cfa8bc2b4180c197ee733d4582e9201be5397072715c6436","engine/pyodide/fonttools-4.51.0-py3-none-any.whl":"0c9a46b9246333de02d0fe02c0580840d7136744121f256a870218ed7482b607","engine/pyodide/idna-3.7-py3-none-any.whl":"9d4685891e3e37434e09b1becda7e96a284e660c7aea9222564d88b6c3527c09","engine/pyodide/openssl-1.1.1w.zip":"20b92cd9b9adb1a739af9f93772b60c084203aacf63ae1b2353951bd80c97f08","engine/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"43eab147a9355385a99eeac18fb577d4af2fe4bd0bbd23d3ba3ddb92e72c2815","engine/pyodide/pycparser-2.22-py3-none-any.whl":"9c907f3feea2a7cfdfcf6e2d95cf4de123ac41a9afc1a724fd72377385000385","engine/pyodide/pyodide-lock.json":"9c45b916001a750f4102fc287494f3eab215909c7535c626a20db80fd6333e2c","engine/pyodide/pyodide.asm.js":"6b4c90de5b7172873f04f21884d0e9d2274e305fe32116558fe3e4fbe3618d51","engine/pyodide/pyodide.asm.wasm":"a50dd1843f805a0b7c45b61037ee0d7b26dfe85efe0e18ef95a34ad24e401f5f","engine/pyodide/pyodide.js":"b4cb23a53aba19c221659b9fb40a2f18281d685691dc06647fb0afd0681baf98","engine/pyodide/pyodide.mjs":"04c052c815abb0bf2981fa38c2dfa58e3120ee5288c956df2b2a15e301782c5f","engine/pyodide/python_stdlib.zip":"16611534726e5d8ac2bd8f926410b2dcb8d6f49aa24913463533b457a2115c16","engine/pyodide/requests-2.31.0-py3-none-any.whl":"aa9e565a1522a7b700e0801c429f7139c5e5c56d22c1b20e2987351a5e0cc48b","engine/pyodide/six-1.16.0-py2.py3-none-any.whl":"f61235bc3a15086f0369585e5071ae9ba0bd244a111d12b37f683862e6850c0a","engine/pyodide/sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"43061928762b03482676a1e11dcef99a003148e59fe914b6a3e41180c382cfc3","engine/pyodide/ssl-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"1af0b011a3043331a8a2a358832dcee736deff73a55ad0393222ea533942094a","engine/pyodide/urllib3-2.2.3-py3-none-any.whl":"902ea205c74f46402ea539ac68a7095117d20734c7ee6b7a6de1ca88224604f9"}};
const VERSION = CONFIG.version;
const CACHE = "cardvault-shell-" + VERSION;                // the page and the few fixed-name files of THIS version
const ASSETS = "cardvault-assets";                         // hashed names: the same name is the same file in every version
const ENGINE = "cardvault-engine-" + CONFIG.engineKey;
const SHELL = CONFIG.shell;
const BUILT = new Set(CONFIG.built);                       // every assets/ name this version was built with
const SUMS = CONFIG.sums;
const isEngine = (u) => u.indexOf("engine/pyodide/") >= 0;
const assetName = (u) => { const p = String(u).split("?")[0].split("#")[0], i = p.lastIndexOf("/assets/"); return i >= 0 ? "assets/" + p.slice(i + 8) : (p.startsWith("assets/") ? p : ""); };
// an engine file is kept only when it is exactly the one this version was built with (an empty or half-sent file from a release still uploading used to be kept forever, and the app never started)
const hex = (b) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");
async function keepEngine(key, r) {
  try {
    const u = typeof key === "string" ? key : key.url, want = SUMS[u.slice(u.indexOf("engine/pyodide/")).split("?")[0]];
    if (!r || !r.ok || !want) return;
    if (hex(await crypto.subtle.digest("SHA-256", await r.clone().arrayBuffer())) !== want) return;          // not kept: asked again next time
    await (await caches.open(ENGINE)).put(key, r);
  } catch (err) { /* not kept: asked again next time */ }
}
async function keepEngineFile(u) {
  try {
    const url = new URL(u, self.registration.scope);
    if (url.origin !== location.origin || url.pathname.indexOf("/engine/") < 0) return;
    const eng = isEngine(url.href), c = await caches.open(eng ? ENGINE : CACHE);
    if (await c.match(url.href)) return;
    const r = await fetch(url.href, { cache: "force-cache" });
    if (!r || !r.ok) return;
    if (eng) await keepEngine(url.href, r); else await c.put(url.href, r);
  } catch (err) { /* kept the first time it goes through this worker */ }
}
// a hashed file is fetched once and kept for every later version that still uses it (strict: at install a shell file that can't be fetched fails the install, which the browser tries again later)
async function keepAsset(name, strict) {
  try {
    const c = await caches.open(ASSETS);
    if (await c.match(name)) return;
    const r = await fetch(name);
    if (r && r.ok) await c.put(name, r);
    else if (strict) throw new Error("not fetched: " + name);
  } catch (err) { if (strict) throw err; /* offline: kept the first time it is used */ }
}
// the few app-specific files that keep the SAME name in every version are fetched past the browser's own cache (it may keep them for a day)
const fresh = (u) => u.includes("manifest.webmanifest") || u === "./" || u === "index.html";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => (assetName(u) ? keepAsset(u, true) : c.add(new Request(u, fresh(u) ? { cache: "reload" } : {}))))))
    .then(() => pushGate()));
});          // a new version WAITS until the person presses Refresh (or closes every tab): taking over by itself used to reload the page under them mid-work
// once this version is in charge: older versions' caches go, and hashed files this version no longer has are dropped (the engine cache stays while its files are unchanged)
async function tidy() {
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => (k.startsWith("cardvault-shell-") && k !== CACHE) || (k.startsWith("cardvault-engine-") && k !== ENGINE)).map((k) => caches.delete(k)));
  try {
    const c = await caches.open(ASSETS);
    for (const req of await c.keys()) if (!BUILT.has(assetName(req.url))) await c.delete(req);
  } catch (err) { /* tidied next time */ }
}
self.addEventListener("activate", (e) => { e.waitUntil(tidy().then(() => self.clients.claim())); });
// ---- update notifications: a new version is announced even when the app isn't open (where the browser allows background checks)
const newer = (a, b) => { const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
// ---- the required-update gate (cardvault/appgate.py; the hub sets <site>/app-gate.json with tools/app_gate.py): this version installing is the push that reaches pages of older
// versions still open.  Each is told to reload into this version: pages of 3.3.0 and newer reload on {type: "refresh"}; pages with the update screen (newer than UNGATED_UPTO)
// first compare `required` with their own version (appGate.js).  Only a rule above UNGATED_UPTO is pushed: an older page reloads on any "refresh", checked or not.
const UNGATED_UPTO = "3.50.137";
async function pushGate() {
  try {
    const r = await fetch("app-gate.json?ts=" + Date.now(), { cache: "no-store" });
    if (!r || !r.ok) return;
    const g = await r.json(), min = String((g && g.min) || "");
    if (!/^\d+\.\d+\.\d+$/.test(min) || newer(min, VERSION) || !newer(min, UNGATED_UPTO)) return;          // no rule, this version is too old itself, or the rule stops nobody old
    const scope = (self.registration && self.registration.scope) || "", preview = scope + "preview/";
    for (const c of await self.clients.matchAll({ type: "window", includeUncontrolled: true })) {
      if (c.url.startsWith(scope) && (scope.endsWith("/preview/") || !c.url.startsWith(preview))) c.postMessage({ type: "refresh", required: min, from: VERSION });          // (the preview is its own channel)
    }
  } catch (err) { /* offline: the pages ask for the rule themselves */ }
}
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
  if (e.data && e.data.type === "skip-if-alone") e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => { if (list.length <= 1) return self.skipWaiting(); }));
  // the first visit loads before this worker is in charge: the page names the app files it already uses (its language, screens opened) so they are kept too - only names of this build
  // ...and, once its engine is up, the engine's own files (fetched before this worker was in charge): taken from the browser's cache, never downloaded again
  if (e.data && e.data.type === "keep-engine" && Array.isArray(e.data.urls)) e.waitUntil(Promise.all(e.data.urls.slice(0, 20).map(keepEngineFile)));
  if (e.data && e.data.type === "keep" && Array.isArray(e.data.urls)) e.waitUntil(Promise.all(e.data.urls.slice(0, 200).map(assetName).filter((n) => BUILT.has(n)).map(keepAsset)));
});
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
  // the account and data servers on this same address (/v1/ ...): ALWAYS the network, never kept - a kept /v1/wait answer was replayed instantly forever (a busy loop) and kept
  // /v1/docs or /v1/records reads made saving fail ("Not saved to your account yet")
  if (/\/(v1|q|api|events)\//.test(url.pathname) || e.request.headers.has("Authorization") || e.request.cache === "no-store") return;
  const page = e.request.mode === "navigate" || url.pathname.endsWith("/version.json") || url.pathname.endsWith("/index.html");
  const store = (r) => { if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; };
  if (page) {                                                                       // the page itself: network first, past the browser's own cache, so every start loads the NEWEST version
    let req = e.request; try { req = new Request(e.request, { cache: "no-cache" }); } catch (err) { /* this browser can't: the plain request */ }
    e.respondWith(fetch(req).then(store).catch(() => caches.open(CACHE).then((c) => c.match(e.request).then((m) => m || c.match("index.html")).then((m) => m || c.match("./")))));
    return;
  }
  const eng = isEngine(url.pathname), hashed = !eng && url.pathname.indexOf("/assets/") >= 0 && !url.search;
  if (hashed) {                                                                     // a hashed file: the same name is the same bytes, so the copy kept by any version is right
    e.respondWith(caches.open(ASSETS).then((c) => c.match(e.request).then((m) => m || fetch(e.request).then((r) => { if (r && r.ok) { const copy = r.clone(); e.waitUntil(c.put(e.request, copy)); } return r; }))));
    return;
  }
  // everything else is this version's own (engine files checked against this build's fingerprints; fixed names in this version's cache): from the cache, fetched once.
  // ONLY this version's own caches: an older copy's fixed-name files (the engine!) must never be served to a newer page
  e.respondWith(caches.open(eng ? ENGINE : CACHE).then((c) => c.match(e.request)).then((m) => m || (eng ? fetch(e.request.url, { cache: "no-cache" }) : fetch(e.request)).then((r) => { if (r && r.ok) { const copy = r.clone(); if (eng) e.waitUntil(keepEngine(e.request, copy)); else e.waitUntil(caches.open(CACHE).then((c) => c.put(e.request, copy))); } return r; })));
});
