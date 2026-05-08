import type { Env } from "./types";

const API = "https://api.github.com";

function headers(env: Env, extra: Record<string, string> = {}) {
  return {
    "Authorization": `Bearer ${env.API}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-drive",
    ...extra
  };
}
const branch = (env: Env) => env.GH_BRANCH || "main";

export function rawUrl(env: Env, path: string): string {
  return `https://raw.githubusercontent.com/${env.GH_REPO}/${branch(env)}/${path}`;
}

export async function ghGetFile(env: Env, path: string): Promise<{ content: string; sha: string; size: number } | null> {
  const r = await fetch(`${API}/repos/${env.GH_REPO}/contents/${encodeURI(path)}?ref=${branch(env)}`, { headers: headers(env) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub get ${path}: ${r.status} ${await r.text()}`);
  const j: any = await r.json();
  return { content: j.content || "", sha: j.sha, size: j.size };
}

export async function ghGetFileRaw(env: Env, path: string): Promise<string | null> {
  const f = await ghGetFile(env, path);
  if (!f) return null;
  // GitHub returns base64 with newlines
  const b64 = f.content.replace(/\n/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export async function ghPutFile(env: Env, path: string, contentBase64: string, message: string, sha?: string): Promise<{ sha: string }> {
  const body: any = { message, content: contentBase64, branch: branch(env) };
  if (sha) body.sha = sha;
  const r = await fetch(`${API}/repos/${env.GH_REPO}/contents/${encodeURI(path)}`, {
    method: "PUT", headers: headers(env, { "Content-Type": "application/json" }), body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`GitHub put ${path}: ${r.status} ${await r.text()}`);
  const j: any = await r.json();
  return { sha: j.content?.sha };
}

export async function ghDeleteFile(env: Env, path: string, sha: string, message: string): Promise<void> {
  const r = await fetch(`${API}/repos/${env.GH_REPO}/contents/${encodeURI(path)}`, {
    method: "DELETE",
    headers: headers(env, { "Content-Type": "application/json" }),
    body: JSON.stringify({ message, sha, branch: branch(env) })
  });
  if (!r.ok) throw new Error(`GitHub delete ${path}: ${r.status} ${await r.text()}`);
}

export async function ghListDir(env: Env, dir: string): Promise<Array<{ name: string; size: number; sha: string; path: string; type: string }>> {
  const r = await fetch(`${API}/repos/${env.GH_REPO}/contents/${encodeURI(dir)}?ref=${branch(env)}`, { headers: headers(env) });
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(`GitHub list ${dir}: ${r.status} ${await r.text()}`);
  const j: any = await r.json();
  if (!Array.isArray(j)) return [];
  return j;
}

// base64 encode large binary safely
export function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)) as any);
  }
  return btoa(bin);
}

export type Meta = { username: string; passwordHash: string; createdAt: string };

export const userDir = (u: string) => `USER/${u}`;
export const userMetaPath = (u: string) => `USER/${u}/meta.json`;
export const userFilesDir = (u: string) => `USER/${u}/files`;
export const userFilePath = (u: string, name: string) => `USER/${u}/files/${name}`;

export function validUsername(u: string): boolean {
  return /^[a-zA-Z0-9_\-]{2,32}$/.test(u);
}
export function safeFilename(n: string): string {
  // strip path separators and control chars; allow most printable
  return n.replace(/[\\/\x00-\x1f]/g, "_").slice(0, 200);
}
