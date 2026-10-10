// Talks to the private GitHub data repository (REST "contents" API).  Same contract as cardvault/cloud/backend.py:
// read() -> {data, etag} or null; write() fails with Conflict when somebody saved in between.

export class Conflict extends Error {}
export class AuthError extends Error {}

function b64ToBytes(b64) {
  const bin = atob(b64.replace(/\n/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export class GitHubStore {
  constructor({ token, repo, branch = "main", base = "https://api.github.com" }) {
    this.token = token; this.repo = repo; this.branch = branch; this.base = base;
  }

  headers(extra = {}) {
    return { Authorization: `Bearer ${this.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...extra };
  }

  url(path) {
    return `${this.base}/repos/${this.repo}/contents/${path}?ref=${encodeURIComponent(this.branch)}`;
  }

  async meta(path) {
    const r = await fetch(this.url(path), { headers: this.headers(), cache: "no-store" });
    if (r.status === 404) return null;
    if (r.status === 401 || r.status === 403) throw new AuthError("GitHub refused access - check the token and the data repository name");
    if (!r.ok) throw new Error(`GitHub error ${r.status}`);
    return r.json();
  }

  async read(path) {
    const m = await this.meta(path);
    if (!m) return null;
    if (Array.isArray(m)) return { list: m.map((x) => x.name) };
    if (m.content) return { data: b64ToBytes(m.content), etag: m.sha };
    const raw = await fetch(this.url(path), { headers: this.headers({ Accept: "application/vnd.github.raw+json" }), cache: "no-store" });
    if (!raw.ok) throw new Error(`GitHub error ${raw.status}`);
    return { data: new Uint8Array(await raw.arrayBuffer()), etag: m.sha };
  }

  async etag(path) {
    const m = await this.meta(path);
    return m && !Array.isArray(m) ? m.sha : null;
  }

  async write(path, bytes, etag, message = "Update from phone") {
    const body = { message, content: bytesToB64(bytes), branch: this.branch };
    if (etag) body.sha = etag;
    const r = await fetch(`${this.base}/repos/${this.repo}/contents/${path}`, { method: "PUT", headers: this.headers({ "Content-Type": "application/json" }), body: JSON.stringify(body) });
    if (r.status === 409 || r.status === 422) throw new Conflict(path);
    if (r.status === 401 || r.status === 403) throw new AuthError("GitHub refused to save - the token needs write access (Contents: read and write) to the data repository");
    if (!r.ok) throw new Error(`GitHub error ${r.status}`);
    return (await r.json()).content.sha;
  }
}

export async function gunzipJson(bytes) {
  const ds = new DecompressionStream("gzip");
  const stream = new Blob([bytes]).stream().pipeThrough(ds);
  return JSON.parse(await new Response(stream).text());
}

export const decode = (bytes) => new TextDecoder().decode(bytes);
export const encode = (text) => new TextEncoder().encode(text);
