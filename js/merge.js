// Merge rules for the shared collection data - the SAME rules as cardvault/cloud/snapshot.py (last writer wins per record;
// removed wishlist entries / corrections are remembered as tombstones).  Keep the two in step.

export const FORMAT = 1;
const ts = (r) => (r && r.updated_at) || "";

export function nowIso() {
  // same shape as the desktop app: UTC with microseconds, sortable as text
  return new Date().toISOString().replace("Z", "000Z");
}

export function uuid() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

function latest(a, b, key) {
  const out = new Map();
  for (const rec of [...(a || []), ...(b || [])]) {
    const k = key(rec);
    const cur = out.get(k);
    // later timestamp wins; on an exact tie keep the one seen first (the local one when a is local)
    if (!cur || ts(rec) > ts(cur)) out.set(k, rec);
  }
  return out;
}

function mergeHard(local, remote, listKey, kind, key) {
  const recs = latest(local[listKey], remote[listKey], key);
  const tombs = new Map();
  for (const t of [...(local.tombstones || []), ...(remote.tombstones || [])]) {
    if (t.kind !== kind) continue;
    const cur = tombs.get(t.key);
    if (!cur || t.deleted_at > cur.deleted_at) tombs.set(t.key, t);
  }
  const alive = [], dead = [];
  for (const [k, rec] of recs) {
    const t = tombs.get(k);
    if (t && t.deleted_at >= ts(rec)) continue;
    alive.push(rec);
  }
  for (const [k, t] of tombs) {
    if (!recs.has(k) || t.deleted_at >= ts(recs.get(k))) dead.push(t);
  }
  return { alive, dead };
}

const byKey = (f) => (a, b) => (f(a) < f(b) ? -1 : f(a) > f(b) ? 1 : 0);

export function merge(local, remote) {
  remote = remote || {};
  const out = { format: FORMAT, game: local.game, user: local.user };
  out.lots = [...latest(local.lots, remote.lots, (r) => r.uuid).values()].sort(byKey((r) => r.uuid));
  out.checklists = [...latest(local.checklists, remote.checklists, (r) => r.uuid).values()].sort(byKey((r) => r.uuid));
  out.custom_groups = [...latest(local.custom_groups, remote.custom_groups, (r) => r.key).values()].sort(byKey((r) => r.key));
  const wl = mergeHard(local, remote, "wishlist", "wishlist", (r) => r.card_id);
  const tg = mergeHard(local, remote, "tags", "tag", (r) => `${r.card_id}|${r.tag}`);
  out.wishlist = wl.alive.sort(byKey((r) => r.card_id));
  out.tags = tg.alive.sort(byKey((r) => `${r.card_id}|${r.tag}`));
  out.tombstones = [...wl.dead, ...tg.dead].sort(byKey((t) => `${t.kind}|${t.key}`));
  return out;
}

export function canonical(s) {
  const { device, exported, derived, ...rest } = s || {};
  return stable(rest);
}

// JSON with sorted keys (matches Python's json.dumps(sort_keys=True) closely enough for equality checks)
export function stable(v) {
  if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
  if (v && typeof v === "object") return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + stable(v[k])).join(",") + "}";
  return JSON.stringify(v);
}

export function emptySnapshot(game, user = "local") {
  return { format: FORMAT, game, user, lots: [], wishlist: [], checklists: [], custom_groups: [], tags: [], tombstones: [] };
}
