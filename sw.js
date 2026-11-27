// Offline support: keeps the app available without a connection and picks up new versions automatically.  Built from ui/build/sw.template.js by ui/build/pwa.js
// (the build puts this version's lists in CONFIG below).
//  - install keeps ONLY the app shell (the page, the first-screen script and style, icons, manifest); every other screen, language and the scanner is kept the first time it is used
//  - files with the content hash in their name (assets/) live in ONE cache shared by every version: an update fetches only the names that are new, and names no longer built are dropped
//  - the engine (engine/pyodide/) has a cache of its own, filled the first time the engine starts (never at install), and keeps only files whose SHA-256 matches this build
const CONFIG = {"version":"3.50.158","engineKey":"609f4c45e5","shell":["./","assets/index-DoEP-FvC.js","assets/react-3sQq0HIT.js","assets/i18n-CfnEeyk0.js","assets/charts-0IQSg1eT.js","assets/engine-client-iDk7yDYL.js","assets/index-DDPdzbfD.css","icons/apple-touch-icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-192.png","icons/icon-maskable-512.png","manifest.webmanifest"],"built":["assets/2023sv-cyE0V8cj.png","assets/2024sv-Ci1yPIhU.png","assets/AddCardBody-Cdd8g_z_.js","assets/AlertsBody-BmJAAJ8U.js","assets/AvatarEditor-7TGja5V2.js","assets/BarcodeScan-D-vXNULz.js","assets/BulkEditPanel-d8g8TWPO.js","assets/CardPicker-B7M9rpbh.js","assets/ComicBits-W_YGr8kL.js","assets/Compare-KlTPHtkt.js","assets/CustomItem-BSUm0EC5.js","assets/Decks-PClV3Vna.js","assets/Dev-CnKblFaM.css","assets/Dev-DYI9grIF.js","assets/DevChanges-D58ojLcs.js","assets/FriendTools-CZ6xYW_m.js","assets/FriendTradeWindow-3laPd8RP.js","assets/FriendsPage-Co4Q1Yg4.js","assets/GameLinks-pyQK0w6-.js","assets/Games-BUdk9y-d.js","assets/GetApp-DWzCbcQw.js","assets/GradedPop-COhqL-Om.js","assets/Grading-vk1qJiSn.js","assets/GradingSend-D6fM6fmJ.js","assets/History-BPsdeBi4.js","assets/ImportList-B_2pxisE.css","assets/ImportList-DSEy_nbF.js","assets/ImportModal-D7yfGOzo.js","assets/Insights-DKNsvcdN.js","assets/InsuranceReport-CdT0gZHf.js","assets/Inventory-BmKAx4MC.js","assets/KnownNote-Y7sg5bYy.js","assets/LanguageCard-1etWNBz7.js","assets/LanguageCard-Dwkbvor0.css","assets/Legal-B-0W6p4D.js","assets/MarkSold-P6KZ8zt4.js","assets/MarketIndexBody-BrxPjh3k.js","assets/MarketIndexBody-CzEobZ1V.css","assets/MasterSet-adc7blx4.js","assets/MissingModal-BMaEgoYW.js","assets/MoveBridge-DFrd8aQq.js","assets/MoveReview-B-AUq5S9.js","assets/OAuthConsent-DkAdFxcz.js","assets/Organize-BUx0p0c-.js","assets/OrganizeExtras-DMsoySRd.js","assets/PackArts-gwSRQScT.js","assets/PageHead-fxheNuhy.js","assets/PhoneSettings-C058Czcm.js","assets/Plan-Be5fzmxH.js","assets/PortfolioManager-uQqtmcbQ.js","assets/PriceDetail-CFqj6C-Y.js","assets/PriceWatch-DWjVq7pb.js","assets/PriceWatchBody-vAHLqm8A.js","assets/ProfitLoss-BRrjS4V0.js","assets/Races-DbwDp6f8.js","assets/ReleaseCalendar-Cw1peosZ.js","assets/Scanner-DdznFm2Y.js","assets/SealedPage-CgyPNFQ0.js","assets/SealedSheet-DDW7RVLj.js","assets/Settings-DLPBiBRK.js","assets/ShareHub-i9NAOhZT.js","assets/ShareLock-M-66WQ3Q.js","assets/SignedFields-vWKlHwnb.js","assets/SoldHistory-WJmnm5oh.js","assets/Trade-CEnjbajB.js","assets/Trade-Dpek4Zmv.css","assets/UnifyOffer-B7iUchPQ.js","assets/V2Note-DLvA_Kq0.js","assets/Wishlist-DEOC6Qtu.css","assets/Wishlist-x3T3LGrg.js","assets/_virtual_guest-boot-DCa2m4u8.js","assets/answers-CwhJDGF9.js","assets/buddyfight-BRUt0haN.webp","assets/charts-0IQSg1eT.js","assets/cyberpunk-D9vEElDW.webp","assets/dbsfw-Bp491ONq.webp","assets/de-DaLyu4C0.js","assets/dicemasters-DdSzDKj-.webp","assets/digimon-CYDfn1YJ.webp","assets/elestrals-5T1xJHpq.webp","assets/en.sealed-DBKSOHNY.js","assets/en.sold-QG1e-iQi.js","assets/engine-client-iDk7yDYL.js","assets/es-BbCq4oLZ.js","assets/fab-FUB6pAbf.webp","assets/finalfantasy-0gcPCiah.webp","assets/fow-D-Kw7yKx.webp","assets/fr-Da8x_852.js","assets/grandarchive-Dq3PhbQQ.webp","assets/gundam-_96AbHgm.webp","assets/hololive-DmuAq7yT.webp","assets/i18n-CfnEeyk0.js","assets/ibm-plex-mono-cyrillic-500-normal-Ael50iVv.woff","assets/ibm-plex-mono-cyrillic-500-normal-Bq9vWWag.woff2","assets/ibm-plex-mono-cyrillic-600-normal-CTOM6hUh.woff2","assets/ibm-plex-mono-cyrillic-600-normal-fLZuRloM.woff","assets/ibm-plex-mono-cyrillic-ext-500-normal-BIfNGwUT.woff","assets/ibm-plex-mono-cyrillic-ext-500-normal-BqneJy0T.woff2","assets/ibm-plex-mono-cyrillic-ext-600-normal-9HEixskS.woff","assets/ibm-plex-mono-cyrillic-ext-600-normal-V-xxqcpd.woff2","assets/ibm-plex-mono-latin-500-normal-CB9ihrfo.woff","assets/ibm-plex-mono-latin-500-normal-DSY6xOcd.woff2","assets/ibm-plex-mono-latin-600-normal-BgSNZQsw.woff2","assets/ibm-plex-mono-latin-600-normal-DWFSQ4vo.woff","assets/ibm-plex-mono-latin-ext-500-normal-CAhNIIs5.woff2","assets/ibm-plex-mono-latin-ext-500-normal-CZ70TYgx.woff","assets/ibm-plex-mono-latin-ext-600-normal-D38SheWl.woff2","assets/ibm-plex-mono-latin-ext-600-normal-DmB0ttJJ.woff","assets/ibm-plex-mono-vietnamese-500-normal-C8zxqsMH.woff","assets/ibm-plex-mono-vietnamese-500-normal-DZ4AoWbu.woff2","assets/ibm-plex-mono-vietnamese-600-normal-D2EvbN8M.woff2","assets/ibm-plex-mono-vietnamese-600-normal-iLQfcSjf.woff","assets/ibm-plex-sans-cyrillic-ext-wght-normal-d45eAU9y.woff2","assets/ibm-plex-sans-cyrillic-wght-normal-BAAhND-U.woff2","assets/ibm-plex-sans-greek-wght-normal-CmyJS8uq.woff2","assets/ibm-plex-sans-latin-ext-wght-normal-CIII54If.woff2","assets/ibm-plex-sans-latin-wght-normal-IvpUvPa2.woff2","assets/ibm-plex-sans-vietnamese-wght-normal-Dg1JeJN0.woff2","assets/index-D3Mz4UNV.js","assets/index-DDPdzbfD.css","assets/index-DoEP-FvC.js","assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2","assets/inter-cyrillic-wght-normal-DqGufNeO.woff2","assets/inter-greek-ext-wght-normal-DlzME5K_.woff2","assets/inter-greek-wght-normal-CkhJZR-_.woff2","assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2","assets/inter-latin-wght-normal-Dx4kXJAl.woff2","assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2","assets/it-RW18w34i.js","assets/ja-DgiBzF6M.js","assets/metazoo-BvmPZ8WE.webp","assets/numjudge-Bz2CuLyF.js","assets/numread-BWwJOUp8.js","assets/numread-BxMDss9i.onnx","assets/onepiece-DQzrcEG8.webp","assets/plus-jakarta-sans-latin-ext-wght-normal-DmpS2jIq.woff2","assets/plus-jakarta-sans-latin-wght-normal-eXO_dkmS.woff2","assets/plus-jakarta-sans-vietnamese-wght-normal-qRpaaN48.woff2","assets/pokemon-BFSEhwFW.webp","assets/preboot-DtOINGvo.js","assets/pt-DAt4VEjc.js","assets/react-3sQq0HIT.js","assets/routes-BRo8fKKu.js","assets/scrypt-wZu5GT1L.js","assets/shadowverse-CFB6yqJ0.webp","assets/sora-latin-ext-wght-normal-CawQDOvP.woff2","assets/sora-latin-wght-normal-DdqRvwsR.woff2","assets/space-grotesk-latin-ext-wght-normal-D9tNdqV9.woff2","assets/space-grotesk-latin-wght-normal-BhU9QXUp.woff2","assets/space-grotesk-vietnamese-wght-normal-D0rl6rjA.woff2","assets/tradeMath-UpIkP4YL.js","assets/v2-gQTyGyrK.js","assets/v2session-jowOW_QX.js","assets/v2signin-DvwQRtqj.js","assets/vanguard-CNrI4scN.webp","assets/weissschwarz-BSDLvJZM.webp","assets/worker-By56A1Ya.js","assets/yugioh-BKH7oBHe.webp"],"sums":{"engine/pyodide/certifi-2024.12.14-py3-none-any.whl":"a5f31d8fbcd66632ba9fe6face6471c4d4df2e85cd6c46bd0c5ff58eb903a4ad","engine/pyodide/cffi-1.17.1-cp312-cp312-pyodide_2024_0_wasm32.whl":"3844b091b8da880622d16c428a545d6a2753dfc148240f1328019375e6f70868","engine/pyodide/charset_normalizer-3.3.2-py3-none-any.whl":"b83440eee4a1398f9a71186169cdc17b84cdb93a63e61f3c6347dd1463a11fca","engine/pyodide/cryptography-42.0.5-cp312-cp312-pyodide_2024_0_wasm32.whl":"c336f40273d92660cfa8bc2b4180c197ee733d4582e9201be5397072715c6436","engine/pyodide/fonttools-4.51.0-py3-none-any.whl":"0c9a46b9246333de02d0fe02c0580840d7136744121f256a870218ed7482b607","engine/pyodide/idna-3.7-py3-none-any.whl":"9d4685891e3e37434e09b1becda7e96a284e660c7aea9222564d88b6c3527c09","engine/pyodide/openssl-1.1.1w.zip":"20b92cd9b9adb1a739af9f93772b60c084203aacf63ae1b2353951bd80c97f08","engine/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"43eab147a9355385a99eeac18fb577d4af2fe4bd0bbd23d3ba3ddb92e72c2815","engine/pyodide/pycparser-2.22-py3-none-any.whl":"9c907f3feea2a7cfdfcf6e2d95cf4de123ac41a9afc1a724fd72377385000385","engine/pyodide/pyodide-lock.json":"9c45b916001a750f4102fc287494f3eab215909c7535c626a20db80fd6333e2c","engine/pyodide/pyodide.asm.js":"6b4c90de5b7172873f04f21884d0e9d2274e305fe32116558fe3e4fbe3618d51","engine/pyodide/pyodide.asm.wasm":"a50dd1843f805a0b7c45b61037ee0d7b26dfe85efe0e18ef95a34ad24e401f5f","engine/pyodide/pyodide.js":"b4cb23a53aba19c221659b9fb40a2f18281d685691dc06647fb0afd0681baf98","engine/pyodide/pyodide.mjs":"04c052c815abb0bf2981fa38c2dfa58e3120ee5288c956df2b2a15e301782c5f","engine/pyodide/python_stdlib.zip":"16611534726e5d8ac2bd8f926410b2dcb8d6f49aa24913463533b457a2115c16","engine/pyodide/requests-2.31.0-py3-none-any.whl":"aa9e565a1522a7b700e0801c429f7139c5e5c56d22c1b20e2987351a5e0cc48b","engine/pyodide/six-1.16.0-py2.py3-none-any.whl":"f61235bc3a15086f0369585e5071ae9ba0bd244a111d12b37f683862e6850c0a","engine/pyodide/sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"43061928762b03482676a1e11dcef99a003148e59fe914b6a3e41180c382cfc3","engine/pyodide/ssl-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl":"1af0b011a3043331a8a2a358832dcee736deff73a55ad0393222ea533942094a","engine/pyodide/urllib3-2.2.3-py3-none-any.whl":"902ea205c74f46402ea539ac68a7095117d20734c7ee6b7a6de1ca88224604f9"}};
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
