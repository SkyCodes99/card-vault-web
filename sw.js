// Offline support: keeps the app available without a connection and picks up new versions automatically (the cache name carries the version).
const VERSION = "3.50.135";
const CACHE = "cardvault-shell-" + VERSION;
const SHELL = ["./","assets/2023sv-cyE0V8cj.png","assets/2024sv-Ci1yPIhU.png","assets/AddCardBody-DoZeETv9.js","assets/AlertsBody-CD-kPsW1.js","assets/AvatarEditor-B45ghizU.js","assets/BulkEditPanel-BeDzYevm.js","assets/CardPicker-B8NtvAVI.js","assets/ComicBits-BZI8k-lK.js","assets/Compare-CyzWVmlH.js","assets/CustomItem-D_uZQ2Vk.js","assets/de-B32AnNoL.js","assets/Decks-BlN7bYfl.js","assets/Dev-fPNw45ZT.js","assets/DevChanges-B8ozowWZ.js","assets/en.sold-xaD4uFY7.js","assets/es-PBX8TWM1.js","assets/fr-Dm7QmsR-.js","assets/FriendsPage-dV5TPtlv.js","assets/GameLinks-Budvxn6S.js","assets/Games-BL27ne2H.js","assets/GetApp-0DamLPoR.js","assets/GradedPop-CvciKeEj.js","assets/Grading-BZ1gfbn4.js","assets/GradingSend-C4S3Rozf.js","assets/History-S9p3jIDw.js","assets/ImportList-37wHVee5.js","assets/ImportList-_rZXPWl2.css","assets/ImportModal-CRlRdasN.js","assets/index-CwSZwpwc.js","assets/index-D3Mz4UNV.js","assets/index-DduKhHX3.css","assets/Insights-Bnbb60Ij.js","assets/InsuranceReport-CKTy3ec1.js","assets/Inventory-jxNxIL-O.js","assets/it-D8LKC2T4.js","assets/ja-Om5jSKE1.js","assets/keptApi-De55yBPl.js","assets/KnownNote-axvB8pSP.js","assets/LanguageCard-B_tjDLIN.css","assets/LanguageCard-C8f6QmBO.js","assets/Legal-D27iiLWf.js","assets/MarketIndexBody-Bhe85OiV.js","assets/MarketIndexBody-CzEobZ1V.css","assets/MarkSold-CDQWEcH7.js","assets/MasterSet-Lc602jhI.js","assets/MissingModal-CcXv97li.js","assets/numjudge-Bz2CuLyF.js","assets/numread-y-gkwcbP.js","assets/Organize-B9V_Yqpc.js","assets/OrganizeExtras-CtXfhWq_.js","assets/Overview-BTpMS62k.js","assets/PackArts-CjOftRHb.js","assets/PhoneSettings-D5aK2fWH.js","assets/Plan-BFx7QeEw.js","assets/PortfolioManager-JJbKtRzC.js","assets/PriceDetail-B7AhzSkW.js","assets/PriceWatch-BYKzJs7D.js","assets/PriceWatchBody-CPAb9hf1.js","assets/ProfitLoss-CH3nHNSv.js","assets/pt-HokIxBXG.js","assets/Races-C5Wn65fq.js","assets/ReleaseCalendar-CIHUHUS6.js","assets/Scanner-BjMshCRk.js","assets/SealedPage-Csa9VW0f.js","assets/SearchAll-B2-VLRrp.js","assets/Settings-mwLSqmAq.js","assets/ShareHub-CeYM1KWC.js","assets/ShareLock-BdnURg8e.js","assets/SignedFields-C_HGToNR.js","assets/SoldHistory-BTR77aRL.js","assets/Trade-B_1rfoU1.js","assets/tradeMath-DrTmyDTw.js","assets/useOpenResult-BIjXk9lb.js","assets/WhatsNew-D6sNzrSJ.js","assets/Wishlist-D5jdjWla.js","assets/worker-uB65buQB.js","engine/cardvault.zip","engine/pyodide/certifi-2024.12.14-py3-none-any.whl","engine/pyodide/cffi-1.17.1-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/charset_normalizer-3.3.2-py3-none-any.whl","engine/pyodide/cryptography-42.0.5-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/fonttools-4.51.0-py3-none-any.whl","engine/pyodide/idna-3.7-py3-none-any.whl","engine/pyodide/openssl-1.1.1w.zip","engine/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/pycparser-2.22-py3-none-any.whl","engine/pyodide/pyodide-lock.json","engine/pyodide/pyodide.asm.js","engine/pyodide/pyodide.asm.wasm","engine/pyodide/pyodide.js","engine/pyodide/pyodide.mjs","engine/pyodide/python_stdlib.zip","engine/pyodide/requests-2.31.0-py3-none-any.whl","engine/pyodide/six-1.16.0-py2.py3-none-any.whl","engine/pyodide/sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/ssl-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl","engine/pyodide/urllib3-2.2.3-py3-none-any.whl","engine/wheels/defusedxml-0.7.1-py2.py3-none-any.whl","engine/wheels/et_xmlfile-2.0.0-py3-none-any.whl","engine/wheels/fpdf2-2.9.0-py3-none-any.whl","engine/wheels/openpyxl-3.1.5-py2.py3-none-any.whl","engine/wheels/pyodide_http-0.2.2-py3-none-any.whl","engine/wheels.json","icons/apple-touch-icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-192.png","icons/icon-maskable-512.png","index.html","legal/credits.html","legal/delete-account.html","legal/index.html","legal/privacy.html","legal/terms.html","manifest.webmanifest"];
const ENGINE = "cardvault-engine-609f4c45e5";
const isEngine = (u) => u.indexOf("engine/pyodide/") >= 0;
const SUMS = {"engine/pyodide/certifi-2024.12.14-py3-none-any.whl":"a5f31d8fbcd66632ba9fe6face6471c4d4df2e85cd6c46bd0c5ff58eb903a4ad","engine/pyodide/cffi-1.17.1-cp312-cp312-pyodide_2024_0_wasm32.whl":"3844b091b8da880622d16c428a545d6a2753dfc148240f1328019375e6f70868","engine/pyodide/charset_normalizer-3.3.2-py3-none-any.whl":"b83440eee4a1398f9a71186169cdc17b84cdb93a63e61f3c6347dd1463a11fca","engine/pyodide/cryptography-42.0.5-cp312-cp312-pyodide_2024_0_wasm32.whl":"c336f40273d92660cfa8bc2b4180c197ee733d4582e9201be5397072715c6436","engine/pyodide/fonttools-4.51.0-py3-none-any.whl":"0c9a46b9246333de02d0fe02c0580840d7136744121f256a870218ed7482b607","engine/pyodide/idna-3.7-py3-none-any.whl":"9d4685891e3e37434e09b1becda7e96a284e660c7aea9222564d88b6c3527c09","engine/pyodide/openssl-1.1.1w.zip":"20b92cd9b9adb1a739af9f93772b60c084203aacf63ae1b2353951bd80c97f08","engine/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"43eab147a9355385a99eeac18fb577d4af2fe4bd0bbd23d3ba3ddb92e72c2815","engine/pyodide/pycparser-2.22-py3-none-any.whl":"9c907f3feea2a7cfdfcf6e2d95cf4de123ac41a9afc1a724fd72377385000385","engine/pyodide/pyodide-lock.json":"9c45b916001a750f4102fc287494f3eab215909c7535c626a20db80fd6333e2c","engine/pyodide/pyodide.asm.js":"6b4c90de5b7172873f04f21884d0e9d2274e305fe32116558fe3e4fbe3618d51","engine/pyodide/pyodide.asm.wasm":"a50dd1843f805a0b7c45b61037ee0d7b26dfe85efe0e18ef95a34ad24e401f5f","engine/pyodide/pyodide.js":"b4cb23a53aba19c221659b9fb40a2f18281d685691dc06647fb0afd0681baf98","engine/pyodide/pyodide.mjs":"04c052c815abb0bf2981fa38c2dfa58e3120ee5288c956df2b2a15e301782c5f","engine/pyodide/python_stdlib.zip":"16611534726e5d8ac2bd8f926410b2dcb8d6f49aa24913463533b457a2115c16","engine/pyodide/requests-2.31.0-py3-none-any.whl":"aa9e565a1522a7b700e0801c429f7139c5e5c56d22c1b20e2987351a5e0cc48b","engine/pyodide/six-1.16.0-py2.py3-none-any.whl":"f61235bc3a15086f0369585e5071ae9ba0bd244a111d12b37f683862e6850c0a","engine/pyodide/sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"43061928762b03482676a1e11dcef99a003148e59fe914b6a3e41180c382cfc3","engine/pyodide/ssl-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"1af0b011a3043331a8a2a358832dcee736deff73a55ad0393222ea533942094a","engine/pyodide/urllib3-2.2.3-py3-none-any.whl":"902ea205c74f46402ea539ac68a7095117d20734c7ee6b7a6de1ca88224604f9"};
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
// the few app-specific files that keep the SAME name in every version are fetched past the browser's own cache (it may keep them for a day); the big unchanging engine parts are not re-downloaded
const fresh = (u) => u.includes("engine/cardvault.zip") || u.includes("engine/wheels.json") || u.includes("manifest.webmanifest") || u === "./";
self.addEventListener("install", (e) => { e.waitUntil(Promise.all([caches.open(CACHE), caches.open(ENGINE)]).then(([c, eng]) => Promise.all(SHELL.map(async (u) => { if (isEngine(u)) { if (!(await eng.match(u))) { try { await keepEngine(u, await fetch(u, { cache: "reload" })); } catch (err) { /* offline: asked when needed */ } } return; } await c.add(new Request(u, fresh(u) ? { cache: "reload" } : {})); })))); });          // a new version WAITS until the person presses Refresh (or closes every tab): taking over by itself used to reload the page under them mid-work
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
    const eng = isEngine(url.pathname);
    e.respondWith(caches.open(eng ? ENGINE : CACHE).then((c) => c.match(e.request)).then((m) => m || (eng ? fetch(e.request.url, { cache: "no-cache" }) : fetch(e.request)).then((r) => { if (r && r.ok) { const copy = r.clone(); if (eng) e.waitUntil(keepEngine(e.request, copy)); else caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; })));           // ONLY this version's own cache: an older copy's files (the engine!) must never be served to a newer page
  }
});
