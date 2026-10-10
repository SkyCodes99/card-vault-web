// Card Vault phone app: browse sets, tick off cards, change quantities, see checklists and value - kept in step with the desktop app
// through the private data repository (see merge.js / github.js).
import { merge, canonical, nowIso, uuid, emptySnapshot } from "./merge.js";
import { GitHubStore, Conflict, AuthError, gunzipJson, decode, encode } from "./github.js";
import * as kv from "./store.js";
import { WEB_VERSION } from "./version.js";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const GAMES = { pokemon: "Pokémon (English)", pokemon_jp: "Pokémon (Japanese)", onepiece: "One Piece", unionarena: "Union Arena" };

const S = {
  cfg: { repo: "", branch: "main", game: "pokemon", ...kv.cfg.load() },
  catalog: null, snap: null, derived: {}, games: [],
  owned: new Map(), lotsBy: new Map(), wish: new Set(), cardIdx: new Map(), setCards: [], setOwned: [],
  tab: "home", view: null, netFail: false, online: navigator.onLine, lastSync: {}, filter: "all", q: "", era: "", status: "", syncing: false, sheet: null, timer: null, error: "",
};
S.cfg.device = S.cfg.device || "phone-" + uuid().slice(0, 6);
const saveCfg = () => kv.cfg.save(S.cfg);
const gh = () => new GitHubStore({ token: S.cfg.token, repo: S.cfg.repo, branch: S.cfg.branch, ...(S.cfg.base ? { base: S.cfg.base } : {}) });
const connected = () => S.cfg.token && S.cfg.repo;
const snapPath = () => `users/local/${S.cfg.game}.json`;

// ------------------------------------------------------------------------------------------------ loading
async function loadGame(game, { fresh = false } = {}) {
  S.cfg.game = game; saveCfg();
  S.catalog = await kv.get("catalog:" + game);
  S.snap = (await kv.get("snap:" + game)) || emptySnapshot(game);
  S.derived = (await kv.get("derived:" + game)) || {};
  S.lastSync[game] = (await kv.get("lastsync:" + game)) || S.lastSync[game] || "";
  rebuild(); render();
  if (!connected()) return;
  try {
    const have = S.catalog && S.catalog.etag;
    const sha = await gh().etag(`catalog/${game}.json.gz`);
    if (!S.catalog || fresh || sha !== have) {
      status("Downloading the card list…");
      const r = await gh().read(`catalog/${game}.json.gz`);
      if (r && r.data) {
        const cat = await gunzipJson(r.data);
        cat.etag = r.etag;
        S.catalog = cat;
        await kv.set("catalog:" + game, cat);
      } else if (!S.catalog) throw new Error("The card list isn't in your data repository yet - open the desktop app and press 'Sync now'.");
    }
    rebuild(); render();
    await sync(false);
  } catch (e) { fail(e); }
}

async function loadGames() {
  try {
    const r = await gh().read("catalog");
    S.games = (r && r.list ? r.list : []).filter((n) => n.endsWith(".json.gz")).map((n) => n.replace(".json.gz", ""));
  } catch (e) { S.games = S.games.length ? S.games : [S.cfg.game]; }
}

function rebuild() {
  S.owned = new Map(); S.lotsBy = new Map(); S.wish = new Set(); S.cardIdx = new Map(); S.setCards = []; S.setOwned = [];
  if (!S.snap) return;
  for (const l of S.snap.lots) {
    if (l.deleted) continue;
    S.owned.set(l.card_id, (S.owned.get(l.card_id) || 0) + l.qty);
    (S.lotsBy.get(l.card_id) || S.lotsBy.set(l.card_id, []).get(l.card_id)).push(l);
  }
  for (const w of S.snap.wishlist) S.wish.add(w.card_id);
  if (!S.catalog) return;
  S.catalog.sets.forEach(() => { S.setCards.push([]); S.setOwned.push(0); });
  S.catalog.cards.forEach((c, i) => {
    S.cardIdx.set(c[0], i);
    if (c[1] >= 0) { S.setCards[c[1]].push(i); if (S.owned.get(c[0]) > 0) S.setOwned[c[1]]++; }
  });
}

// ------------------------------------------------------------------------------------------------ sync
async function sync(manual) {
  if (!connected() || S.syncing) return;
  S.syncing = true; status("Syncing…");
  const t0 = nowIso();
  try {
    const store = gh();
    for (let attempt = 0; attempt < 4; attempt++) {
      const r = await store.read(snapPath());
      const remote = r && r.data ? JSON.parse(decode(r.data)) : null;
      const merged = merge(S.snap, remote);
      const changed = canonical(merged) !== canonical(S.snap);
      S.snap = merged;
      if (remote && remote.derived) { S.derived = remote.derived; await kv.set("derived:" + S.cfg.game, S.derived); }
      if (!remote || canonical(merged) !== canonical(remote)) {
        const out = { ...merged, device: S.cfg.device, exported: nowIso(), derived: (remote && remote.derived) || {} };
        try { await store.write(snapPath(), encode(JSON.stringify(out)), r && r.etag, `Sync from ${S.cfg.device}`); }
        catch (e) { if (e instanceof Conflict) continue; throw e; }
      }
      await kv.set("snap:" + S.cfg.game, S.snap);
      rebuild();
      status(`Synced ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${changed ? " · new changes received" : ""}`);
      S.error = ""; S.netFail = false; S.lastSync[S.cfg.game] = t0; await kv.set("lastsync:" + S.cfg.game, t0);
      break;
    }
  } catch (e) { fail(e, manual); }
  S.syncing = false; render();
}

function schedule() {
  clearTimeout(S.timer);
  S.timer = setTimeout(() => sync(false), 2500);
}

async function commit() {                // after every edit: save on the phone at once, send to the repository a moment later
  await kv.set("snap:" + S.cfg.game, S.snap);
  rebuild(); render(); schedule();
  if (!S.online) toast("Saved on this phone - will upload when you're online");
}

function status(t) { S.status = t; const el = $("#st"); if (el) el.textContent = t; }
function fail(e) {
  S.error = e instanceof AuthError ? e.message : (e && e.message) || String(e);
  S.netFail = e instanceof TypeError || !navigator.onLine;     // fetch() throws TypeError when there is no connection
  status(S.netFail ? "Offline - changes are saved on this phone and will upload when you're back online" : "Sync problem");
  render();
}

// changes made on this phone that the repository has not received yet
function pendingCount() {
  const since = S.lastSync[S.cfg.game] || ""; const snap = S.snap; if (!snap) return 0;
  const newer = (r) => (r.updated_at || "") > since;
  return snap.lots.filter(newer).length + snap.wishlist.filter(newer).length + (snap.checklists || []).filter(newer).length;
}

function bannerHtml() {
  if (!connected()) return "";
  const n = pendingCount(); const plural = n === 1 ? "change" : "changes";
  if (!S.online || S.netFail) return `<div class="banner off"><b>You're offline.</b> Everything you do is saved on this phone and will upload automatically as soon as you're back online.${n ? ` <b>${n} ${plural} waiting.</b>` : ""}</div>`;
  if (S.error) return `<div class="banner err"><b>Sync problem:</b> ${esc(S.error)}${n ? ` (${n} ${plural} saved on this phone, not uploaded yet)` : ""}</div>`;
  if (n && !S.syncing) return `<div class="banner wait">${n} ${plural} saved on this phone - uploading…</div>`;
  return "";
}
function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (el.hidden = true), 2200); }

// ------------------------------------------------------------------------------------------------ edits
const touch = (r) => { r.updated_at = nowIso(); return r; };
const card = (id) => S.catalog.cards[S.cardIdx.get(id)];
const price = (id) => { const c = card(id); return c ? c[5] : null; };

function newLot(cardId, qty = 1) {
  const c = card(cardId); const t = nowIso();
  return { uuid: uuid(), card_id: cardId, variant: (c && c[8]) || "Normal", condition: "Near Mint", language: "English", qty, graded: 0, grade_company: "", grade: "",
    cert: "", purchase_price: null, notes: "", location: "", edition: "", added: t, updated_at: t, deleted: 0 };
}

async function toggleOwned(id) {
  const live = (S.lotsBy.get(id) || []);
  if (live.length) { if (live.some((l) => l.graded || l.purchase_price != null || l.notes || l.qty > 1) && !confirm("Remove all copies of this card (including price paid / grading / notes)?")) return; live.forEach((l) => { l.deleted = 1; touch(l); }); }
  else S.snap.lots.push(newLot(id));
  await commit();
}

async function adjustQty(id, d) {
  const live = S.lotsBy.get(id) || [];
  if (!live.length) { if (d > 0) { S.snap.lots.push(newLot(id, d)); await commit(); } return; }
  const l = live[0]; l.qty += d;
  if (l.qty <= 0) { l.qty = 0; l.deleted = 1; }
  touch(l); await commit();
}

async function toggleWish(id) {
  if (S.wish.has(id)) {
    S.snap.wishlist = S.snap.wishlist.filter((w) => w.card_id !== id);
    S.snap.tombstones = S.snap.tombstones.filter((t) => !(t.kind === "wishlist" && t.key === id));
    S.snap.tombstones.push({ kind: "wishlist", key: id, deleted_at: nowIso() });
  } else {
    S.snap.tombstones = S.snap.tombstones.filter((t) => !(t.kind === "wishlist" && t.key === id));
    S.snap.wishlist.push({ card_id: id, note: "", updated_at: nowIso() });
  }
  await commit();
}

async function pick(clUuid, slot, cardId) {
  const cl = S.snap.checklists.find((c) => c.uuid === clUuid);
  if (!cl) return;
  cl.picks = cl.picks || {};
  if (cl.picks[slot] === cardId) delete cl.picks[slot]; else cl.picks[slot] = cardId;
  touch(cl); await commit();
}

// ------------------------------------------------------------------------------------------------ views
const imgUrl = (c) => (c[6] ? c[6] + (S.catalog.image_suffix || "") : "");
const money = (v) => "$" + (v || 0).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: v && v < 1000 ? 2 : 0 });

function tileHtml(c, opts = {}) {
  const id = c[0], q = S.owned.get(id) || 0;
  const img = imgUrl(c);
  return `<div class="tile ${q ? "" : "miss"} ${opts.picked ? "picked" : ""}" data-card="${esc(id)}">
    ${img ? `<img loading="lazy" src="${esc(img)}" alt="${esc(c[3])}">` : `<div class="ph">${esc(c[3])}</div>`}
    <button class="chk ${q ? "on" : ""}" data-act="own" data-id="${esc(id)}" aria-label="Owned">${q ? "✓" : ""}</button>
    ${q > 1 ? `<span class="qty">×${q}</span>` : ""}
    ${opts.star ? `<button class="star ${opts.picked ? "primary" : ""}" data-act="pick" data-id="${esc(id)}" aria-label="Choose for the list">★</button>` : ""}
    <div class="t">${esc(opts.title || c[3])}</div><div class="s">${esc(opts.sub || "#" + c[2])}</div></div>`;
}

function viewSets() {
  const cat = S.catalog;
  if (!cat) return `<div class="card mute">${connected() ? "Loading the card list…" : ""}</div>`;
  const eras = [...new Set(cat.sets.map((s) => s[2]).filter(Boolean))];
  const q = S.q.toLowerCase();
  const rows = cat.sets.map((s, i) => ({ s, i })).filter(({ s }) => (!S.era || s[2] === S.era) && (!q || s[1].toLowerCase().includes(q)))
    .sort((a, b) => (b.s[3] || "").localeCompare(a.s[3] || ""));
  return `<div class="topbar"><input id="q" placeholder="Find a set…" value="${esc(S.q)}"><select id="era" style="max-width:46%"><option value="">All series</option>${eras.map((e) => `<option ${e === S.era ? "selected" : ""}>${esc(e)}</option>`).join("")}</select></div>` +
    rows.map(({ s, i }) => {
      const o = S.setOwned[i], n = S.setCards[i].length, p = n ? (100 * o / n) : 0;
      return `<div class="setrow" data-act="set" data-i="${i}"><div class="logo">${s[5] ? `<img loading="lazy" src="${esc(s[5])}" alt="" onerror="this.replaceWith(document.createTextNode(this.dataset.n))" data-n="${esc(s[1].slice(0, 22))}">` : esc(s[1].slice(0, 22))}</div><div class="grow"><b>${esc(s[1])}</b><span class="small mute">${esc(s[2])}${s[3] ? " · " + s[3].slice(0, 4) : ""} · ${o}/${n}</span>
      <div class="bar ${o && o >= n ? "done" : ""}" style="margin-top:6px"><i style="width:${p}%"></i></div></div><div class="pct">${p.toFixed(0)}%</div></div>`;
    }).join("") + (rows.length ? "" : `<p class="mute">No sets match.</p>`);
}

function viewSet() {
  const i = S.view.i, s = S.catalog.sets[i], cards = S.setCards[i].map((ci) => S.catalog.cards[ci]);
  const q = S.q.toLowerCase();
  const list = cards.filter((c) => (S.filter === "all" || (S.filter === "owned") === (S.owned.get(c[0]) > 0)) && (!q || c[3].toLowerCase().includes(q) || c[2].toLowerCase().includes(q)));
  const o = S.setOwned[i], n = cards.length;
  return `<div class="topbar"><button data-act="back">←</button><h1 class="grow" style="font-size:18px">${esc(s[1])}</h1></div>
    <div class="card"><div class="row"><b>${o} / ${n} owned</b><span class="mute">${n ? (100 * o / n).toFixed(1) : 0}%</span></div><div class="bar ${o >= n ? "done" : ""}" style="margin-top:6px"><i style="width:${n ? 100 * o / n : 0}%"></i></div></div>
    <div class="row"><div class="seg grow">${["all", "owned", "missing"].map((f) => `<button class="${S.filter === f ? "on" : ""}" data-act="filter" data-f="${f}">${f[0].toUpperCase() + f.slice(1)}</button>`).join("")}</div></div>
    <div class="topbar" style="position:static"><input id="q" placeholder="Search this set…" value="${esc(S.q)}"></div>
    <div class="grid">${list.map((c) => tileHtml(c)).join("")}</div>`;
}

function listProgress(cl) {
  const d = S.derived.checklists && S.derived.checklists[cl.uuid];
  if (!d) return null;
  if (d.slots) { const slots = d.slots; const o = slots.filter((s) => s.cands.some((id) => S.owned.get(id) > 0)).length; return { o, n: slots.length, d }; }
  const m = d.members || []; return { o: m.filter((id) => S.owned.get(id) > 0).length, n: m.length, d };
}

function viewLists() {
  const lists = (S.snap ? S.snap.checklists : []).filter((c) => !c.deleted).sort((a, b) => a.name.localeCompare(b.name));
  return `<h1>Checklists</h1><p class="mute small">Made on your computer; tick cards here and they update everywhere.</p>` + (lists.map((cl) => {
    const p = listProgress(cl);
    return `<div class="setrow" data-act="list" data-u="${esc(cl.uuid)}"><div class="grow"><b>${esc(cl.name)}</b><span class="small mute">${p ? `${p.o} / ${p.n}` : "open the desktop app to refresh"}</span>
      <div class="bar ${p && p.o >= p.n && p.n ? "done" : ""}" style="margin-top:6px"><i style="width:${p && p.n ? 100 * p.o / p.n : 0}%"></i></div></div><div class="pct">${p && p.n ? (100 * p.o / p.n).toFixed(0) : 0}%</div></div>`;
  }).join("") || `<p class="mute">No checklists yet.</p>`);
}

function viewList() {
  const cl = S.snap.checklists.find((c) => c.uuid === S.view.u); const p = listProgress(cl);
  if (!p) return `<div class="topbar"><button data-act="back">←</button><h1>${esc(cl.name)}</h1></div><p class="mute">Open the desktop app and press "Sync now" so this list's cards can be sent to your phone.</p>`;
  const picks = cl.picks || {};
  let tiles;
  if (p.d.slots) {
    tiles = p.d.slots.filter((s) => S.filter === "all" || (S.filter === "owned") === s.cands.some((id) => S.owned.get(id) > 0)).map((s) => {
      const have = s.cands.filter((id) => S.owned.get(id) > 0), rep = picks[s.key] && s.cands.includes(picks[s.key]) ? picks[s.key] : (have[0] || s.cands[0]);
      if (!rep) return `<div class="tile miss"><div class="ph">No Card Exists</div><div class="t">${esc(s.label)}</div><div class="s">No Card Exists</div></div>`;
      const c = card(rep); if (!c) return "";
      return tileHtml(c, { title: s.label, sub: `${have.length}/${s.cands.length} owned` }).replace('data-card="', `data-slot="${esc(s.key)}" data-card="`);
    }).join("");
  } else {
    tiles = p.d.members.map(card).filter(Boolean).filter((c) => S.filter === "all" || (S.filter === "owned") === (S.owned.get(c[0]) > 0)).map((c) => tileHtml(c)).join("");
  }
  return `<div class="topbar"><button data-act="back">←</button><h1 class="grow" style="font-size:18px">${esc(cl.name)}</h1></div>
    <div class="card"><div class="row"><b>${p.o} / ${p.n}</b><span class="mute">${p.n ? (100 * p.o / p.n).toFixed(1) : 0}%</span></div><div class="bar ${p.o >= p.n ? "done" : ""}" style="margin-top:6px"><i style="width:${p.n ? 100 * p.o / p.n : 0}%"></i></div></div>
    <div class="seg">${["all", "owned", "missing"].map((f) => `<button class="${S.filter === f ? "on" : ""}" data-act="filter" data-f="${f}">${f[0].toUpperCase() + f.slice(1)}</button>`).join("")}</div>
    <div class="grid">${tiles}</div>`;
}

function viewValue() {
  if (!S.catalog) return "";
  let total = 0, copies = 0; const rows = [], bySet = new Map();
  for (const [id, q] of S.owned) {
    const c = card(id); if (!c) continue; const p = (c[5] || 0) * q; total += p; copies += q;
    rows.push([c, q, p]); const sn = S.catalog.sets[c[1]] ? S.catalog.sets[c[1]][1] : "?"; bySet.set(sn, (bySet.get(sn) || 0) + p);
  }
  rows.sort((a, b) => b[2] - a[2]);
  const sets = [...bySet].sort((a, b) => b[1] - a[1]).slice(0, 8), mx = sets[0] ? sets[0][1] : 1;
  return `<h1>Collection value</h1><div class="card"><div class="bigstat">${money(total)}</div><div class="mute small">${S.owned.size.toLocaleString()} different cards · ${copies.toLocaleString()} copies · prices as of the last desktop update</div></div>
    <h2>Where the value is</h2><div class="card">${sets.map(([n, v]) => `<div class="small" style="margin:6px 0"><div class="row"><span class="grow">${esc(n)}</span><b>${money(v)}</b></div><div class="bar"><i style="width:${100 * v / mx}%"></i></div></div>`).join("") || '<span class="mute">Nothing owned yet.</span>'}</div>
    <h2>Most valuable cards</h2>${rows.slice(0, 15).map(([c, q, p]) => `<div class="setrow" data-act="sheet" data-id="${esc(c[0])}"><div class="grow"><b>${esc(c[3])}</b><span class="small mute">${esc((S.catalog.sets[c[1]] || [])[1] || "")} · #${esc(c[2])} · ×${q}</span></div><div class="pct">${money(p)}</div></div>`).join("")}`;
}

function viewSettings() {
  return `<h1>Settings</h1>
  <div class="card"><h2 style="margin-top:0">Connect to your data</h2>
    <p class="mute small">Your collection is stored in a private GitHub repository. Create a fine-grained token limited to that one repository (Contents: read and write) and paste it here. It stays on this phone.</p>
    <label class="small mute">Data repository (owner/name)</label><input id="repo" value="${esc(S.cfg.repo)}" placeholder="yourname/card-vault-data" autocapitalize="none" autocorrect="off">
    <label class="small mute" style="display:block;margin-top:8px">Token</label><input id="token" type="password" value="${esc(S.cfg.token || "")}" placeholder="github_pat_…" autocapitalize="none" autocorrect="off">
    <div class="row" style="margin-top:10px"><button class="primary grow" data-act="connect">Save &amp; sync</button>${connected() ? `<button class="danger" data-act="disconnect">Disconnect</button>` : ""}</div></div>
  <div class="card"><h2 style="margin-top:0">Sync</h2><div id="st" class="small">${esc(S.status || "")}</div>${S.error ? `<div class="small err">${esc(S.error)}</div>` : ""}
    <div class="row" style="margin-top:8px"><button data-act="sync" class="grow" ${S.syncing ? "disabled" : ""}>Sync now</button><button data-act="refresh" class="grow">Reload card list</button></div>
    <p class="mute small">This phone: ${esc(S.cfg.device)}. Changes are saved here instantly and sent to the repository a moment later; the desktop app picks them up within minutes.</p></div>
  <div class="card"><h2 style="margin-top:0">About</h2><p class="small mute">Card Vault phone app ${esc(WEB_VERSION)}. It updates itself whenever a new version is published with the desktop app.
    On iPhone: Share → Add to Home Screen. On Android: menu → Install app.</p></div>`;
}

function viewSetup() {
  return `<h1>Card Vault</h1><p class="mute">Sign in to see the same collection you have on your computer.</p>${viewSettings().replace(/^<h1>Settings<\/h1>/, "")}`;
}

function sheetHtml() {
  const sh = S.sheet; if (!sh) return "";
  const c = card(sh.id); if (!c) return "";
  if (sh.kind === "options") {
    const cl = S.snap.checklists.find((x) => x.uuid === sh.u); const slot = sh.slot;
    const d = S.derived.checklists[sh.u], sl = d.slots.find((s) => s.key === slot), picks = (cl.picks || {});
    return `<div class="sheet-bg" data-act="close"><div class="sheet" onclick="event.stopPropagation()"><div class="row"><h2 class="grow" style="margin:0">${esc(sl.label)}</h2><button data-act="close">Done</button></div>
      <p class="small mute">Tick the card(s) you own. Tap ★ to choose which card is shown on the list.</p>
      <div class="grid">${sl.cands.map(card).filter(Boolean).map((cc) => tileHtml(cc, { star: true, picked: picks[slot] === cc[0], sub: `${(S.catalog.sets[cc[1]] || [])[1] || ""}` })).join("")}</div></div></div>`;
  }
  const lots = S.lotsBy.get(sh.id) || [];
  return `<div class="sheet-bg" data-act="close"><div class="sheet" onclick="event.stopPropagation()">
    <div class="row"><div class="grow"><h2 style="margin:0">${esc(c[3])}</h2><span class="small mute">${esc((S.catalog.sets[c[1]] || [])[1] || "")} · #${esc(c[2])}${S.catalog.rarities[c[4]] ? " · " + esc(S.catalog.rarities[c[4]]) : ""}${c[5] != null ? " · " + money(c[5]) : ""}</span></div><button data-act="close">Done</button></div>
    ${imgUrl(c) ? `<img src="${esc(imgUrl(c))}" style="width:55%;max-width:240px;display:block;margin:10px auto;border-radius:10px">` : ""}
    <div class="row wrap"><button data-act="wish" data-id="${esc(sh.id)}" class="${S.wish.has(sh.id) ? "primary" : ""}">${S.wish.has(sh.id) ? "♥ On wishlist" : "♡ Wishlist"}</button><button data-act="addlot" data-id="${esc(sh.id)}" class="primary">＋ Add a copy</button></div>
    ${lots.map((l) => `<div class="lot" data-lot="${l.uuid}"><div class="row"><b class="grow">${esc(l.variant)} ${l.graded ? "· " + esc(l.grade_company + " " + l.grade) : "· " + esc(l.condition)}</b>
      <button data-act="lotq" data-u="${l.uuid}" data-d="-1">−</button><b>${l.qty}</b><button data-act="lotq" data-u="${l.uuid}" data-d="1">+</button></div>
      <div class="row wrap" style="margin-top:8px"><select data-f="condition" data-u="${l.uuid}" ${l.graded ? "disabled" : ""}>${["Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"].map((x) => `<option ${x === l.condition ? "selected" : ""}>${x}</option>`).join("")}</select>
      <label class="row small"><input type="checkbox" data-f="graded" data-u="${l.uuid}" ${l.graded ? "checked" : ""} style="width:auto"> Graded</label></div>
      ${l.graded ? `<div class="row wrap" style="margin-top:6px"><select data-f="grade_company" data-u="${l.uuid}" style="max-width:32%">${["PSA", "BGS", "CGC", "SGC", "TAG", "ACE", "AGS", "Other"].map((x) => `<option ${x === l.grade_company ? "selected" : ""}>${x}</option>`).join("")}</select>
        <input data-f="grade" data-u="${l.uuid}" value="${esc(l.grade)}" placeholder="Grade" style="max-width:28%"><input data-f="cert" data-u="${l.uuid}" value="${esc(l.cert)}" placeholder="Cert #" class="grow"></div>` : ""}
      <div class="row" style="margin-top:6px"><select data-f="edition" data-u="${l.uuid}">${["", "1st Edition", "Shadowless", "Unlimited", "Stamped", "Prerelease", "Staff", "Promo", "Other"].map((x) => `<option value="${x}" ${x === (l.edition || "") ? "selected" : ""}>${x || "Edition"}</option>`).join("")}</select><input data-f="location" data-u="${l.uuid}" value="${esc(l.location || "")}" placeholder="Stored in (binder, box…)" class="grow"></div>
      <div class="row" style="margin-top:6px"><input data-f="purchase_price" data-u="${l.uuid}" inputmode="decimal" value="${l.purchase_price ?? ""}" placeholder="Paid (each)"><input data-f="notes" data-u="${l.uuid}" value="${esc(l.notes)}" placeholder="Notes"></div></div>`).join("")}
  </div></div>`;
}

const TABS = [["home", "⌂", "Home"], ["sets", "▦", "Sets"], ["lists", "✔", "Lists"], ["value", "＄", "Value"], ["settings", "⚙", "Settings"]];

function render() {
  const app = $("#app"); const keepQ = document.activeElement && document.activeElement.id === "q" ? document.activeElement.selectionStart : null;
  let body;
  if (!connected() && S.tab !== "settings") { S.tab = "settings"; }
  if (!connected()) body = viewSetup();
  else if (S.tab === "home") body = viewHome();
  else if (S.tab === "sets") body = S.view && S.view.type === "set" ? viewSet() : viewSets();
  else if (S.tab === "lists") body = S.view && S.view.type === "list" ? viewList() : viewLists();
  else if (S.tab === "value") body = viewValue();
  else body = viewSettings();
  const gameBar = connected() && S.games.length > 1 && (S.tab === "sets" || S.tab === "settings") && !S.view
    ? `<div class="row" style="margin-bottom:6px"><select id="game">${S.games.map((g) => `<option value="${g}" ${g === S.cfg.game ? "selected" : ""}>${esc(GAMES[g] || g)}</option>`).join("")}</select></div>` : "";
  app.innerHTML = bannerHtml() + gameBar + body + (connected() ? `<div class="small mute" style="margin:14px 0 4px;text-align:center" id="stl">${S.syncing ? "Syncing…" : esc(S.status)}</div>` : "") + sheetHtml();
  $("nav") && $("nav").remove();
  if (connected()) document.body.insertAdjacentHTML("beforeend", `<nav>${TABS.map(([k, ic, lb]) => `<button data-tab="${k}" class="${S.tab === k ? "on" : ""}"><span>${ic}</span>${lb}</button>`).join("")}</nav>`);
  if (keepQ !== null) { const q = $("#q"); if (q) { q.focus(); q.setSelectionRange(keepQ, keepQ); } }
}

// ------------------------------------------------------------------------------------------------ events
document.addEventListener("click", async (e) => {
  const tab = e.target.closest("[data-tab]"); if (tab) { S.tab = tab.dataset.tab; S.view = null; S.q = ""; S.filter = "all"; S.sheet = null; return render(); }
  const a = e.target.closest("[data-act]"); const tile = e.target.closest(".tile[data-card]");
  if (!a && tile) { S.sheet = { kind: "card", id: tile.dataset.card }; return render(); }
  if (!a) return;
  const d = a.dataset, act = d.act;
  if (act === "close") { S.sheet = null; return render(); }
  if (act === "own") { e.stopPropagation(); return toggleOwned(d.id); }
  if (act === "pick") { e.stopPropagation(); return pick(S.sheet.u, S.sheet.slot, d.id); }
  if (act === "wish") return toggleWish(d.id);
  if (act === "addlot") { S.snap.lots.push(newLot(d.id)); return commit(); }
  if (act === "lotq") { const l = S.snap.lots.find((x) => x.uuid === d.u); l.qty = Math.max(0, l.qty + Number(d.d)); if (!l.qty) l.deleted = 1; touch(l); return commit(); }
  if (act === "set") { S.view = { type: "set", i: Number(d.i) }; S.q = ""; S.filter = "all"; return render(); }
  if (act === "list") { S.view = { type: "list", u: d.u }; S.q = ""; S.filter = "all"; return render(); }
  if (act === "back") { S.view = null; S.q = ""; S.filter = "all"; return render(); }
  if (act === "filter") { S.filter = d.f; return render(); }
  if (act === "sheet") { S.sheet = { kind: "card", id: d.id }; return render(); }
  if (act === "connect") { S.cfg.repo = $("#repo").value.trim(); S.cfg.token = $("#token").value.trim(); saveCfg(); S.error = ""; await loadGames(); S.tab = "sets"; return loadGame(S.cfg.game, { fresh: true }); }
  if (act === "disconnect") { if (confirm("Disconnect this phone? Your data stays in the repository.")) { S.cfg.token = ""; saveCfg(); S.status = ""; S.view = null; render(); } return; }
  if (act === "sync") return sync(true);
  if (act === "refresh") return loadGame(S.cfg.game, { fresh: true });
});

// slot tiles (Pokédex lists) open an options sheet instead of the plain card sheet
document.addEventListener("click", (e) => {
  const t = e.target.closest(".tile[data-slot]");
  if (t && !e.target.closest("[data-act]") && S.view && S.view.type === "list") {
    e.stopImmediatePropagation(); S.sheet = { kind: "options", id: t.dataset.card, u: S.view.u, slot: t.dataset.slot }; render();
  }
}, true);

document.addEventListener("input", (e) => {
  if (e.target.id === "q") { S.q = e.target.value; render(); }
});
document.addEventListener("change", async (e) => {
  const t = e.target;
  if (t.id === "era") { S.era = t.value; return render(); }
  if (t.id === "game") { S.view = null; return loadGame(t.value); }
  if (t.dataset.f && t.dataset.u) {
    const l = S.snap.lots.find((x) => x.uuid === t.dataset.u); if (!l) return;
    const f = t.dataset.f;
    if (f === "graded") l.graded = t.checked ? 1 : 0;
    else if (f === "purchase_price") l.purchase_price = t.value === "" ? null : Number(t.value);
    else l[f] = t.value;
    if (f === "graded") l.condition = t.checked ? "Graded" : "Near Mint";
    touch(l); await commit();
  }
});

document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") sync(false); });
window.addEventListener("online", () => { S.online = true; S.netFail = false; render(); sync(false); });
window.addEventListener("offline", () => { S.online = false; render(); });
setInterval(() => { if (document.visibilityState === "visible") sync(false); }, 60000);

// ------------------------------------------------------------------------------------------------ start
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then((reg) => {
    reg.addEventListener("updatefound", () => {
      const w = reg.installing;
      w && w.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) toast("New version installed - reload to use it"); });
    });
  }).catch(() => {});
}
(async () => {
  render();
  if (connected()) { await loadGames(); await loadGame(S.cfg.game); }
})();

// ------------------------------------------------------------------------------------------------ home (the phone's 'widget' screen)
function viewHome() {
  if (!S.catalog) return `<h1>Card Vault</h1><div class="card mute">${connected() ? "Loading your collection…" : ""}</div>`;
  let total = 0, copies = 0, paid = 0, gain = 0;
  for (const [id, q] of S.owned) { const c = card(id); if (c) { total += (c[5] || 0) * q; copies += q; } }
  for (const l of S.snap.lots) { if (l.deleted || l.purchase_price == null) continue; const c = card(l.card_id); if (!c || c[5] == null) continue; paid += l.purchase_price * l.qty; gain += (c[5] - l.purchase_price) * l.qty; }
  const lists = (S.snap.checklists || []).filter((c) => !c.deleted).map((cl) => ({ cl, p: listProgress(cl) })).filter((x) => x.p && x.p.n)
    .sort((a, b) => (b.p.o >= b.p.n ? -1 : 0) - (a.p.o >= a.p.n ? -1 : 0) || (b.p.o / b.p.n) - (a.p.o / a.p.n)).slice(0, 4);
  const sets = S.catalog.sets.map((s, i) => ({ s, i, o: S.setOwned[i], n: S.setCards[i].length })).filter((x) => x.o > 0 && x.o < x.n).sort((a, b) => b.o / b.n - a.o / a.n).slice(0, 4);
  const recent = S.snap.lots.filter((l) => !l.deleted).sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || "")).slice(0, 5);
  const bar = (o, n) => `<div class="bar ${n && o >= n ? "done" : ""}" style="margin-top:6px"><i style="width:${n ? 100 * o / n : 0}%"></i></div>`;
  return `<h1>Card Vault</h1>
    <div class="card"><div class="mute small">Estimated value</div><div class="bigstat">${money(total)}</div><div class="mute small">${S.owned.size.toLocaleString()} different cards · ${copies.toLocaleString()} copies${paid ? ` · ${gain >= 0 ? "+" : "−"}${money(Math.abs(gain))} vs what you paid` : ""}</div></div>
    ${lists.length ? `<h2>Checklists</h2>${lists.map(({ cl, p }) => `<div class="setrow" data-act="list" data-u="${esc(cl.uuid)}"><div class="grow"><b>${esc(cl.name)}</b><span class="small mute">${p.o} / ${p.n}</span>${bar(p.o, p.n)}</div><div class="pct">${(100 * p.o / p.n).toFixed(0)}%</div></div>`).join("")}` : ""}
    ${sets.length ? `<h2>Sets you're working on</h2>${sets.map(({ s, i, o, n }) => `<div class="setrow" data-act="set" data-i="${i}"><div class="grow"><b>${esc(s[1])}</b><span class="small mute">${o} / ${n}</span>${bar(o, n)}</div><div class="pct">${(100 * o / n).toFixed(0)}%</div></div>`).join("")}` : ""}
    ${recent.length ? `<h2>Recently changed</h2>${recent.map((l) => { const c = card(l.card_id); return c ? `<div class="setrow" data-act="sheet" data-id="${esc(c[0])}"><div class="grow"><b>${esc(c[3])}</b><span class="small mute">${esc((S.catalog.sets[c[1]] || [])[1] || "")} · ×${l.qty}${l.location ? " · " + esc(l.location) : ""}</span></div><div class="pct">${money((c[5] || 0) * l.qty)}</div></div>` : ""; }).join("")}` : ""}`;
}

