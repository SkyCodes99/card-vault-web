// Small IndexedDB key/value store: keeps the card list and your data on the phone so the app opens instantly and works offline.
const DB = "cardvault", STORE = "kv";

function open() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function get(key) {
  const db = await open();
  return new Promise((res, rej) => {
    const q = db.transaction(STORE).objectStore(STORE).get(key);
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
}

export async function set(key, value) {
  const db = await open();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export const cfg = {
  load() { try { return JSON.parse(localStorage.getItem("cv_cfg") || "{}"); } catch { return {}; } },
  save(c) { localStorage.setItem("cv_cfg", JSON.stringify(c)); },
};
