// Lightweight HS256 JWT using Web Crypto.

function b64urlEncode(data: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof data === "string") bytes = new TextEncoder().encode(data);
  else if (data instanceof Uint8Array) bytes = data;
  else bytes = new Uint8Array(data);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signJWT(payload: Record<string, any>, secret: string, ttlSec = 60 * 60 * 24 * 7): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + ttlSec, ...payload };
  const head = b64urlEncode(JSON.stringify(header));
  const pl = b64urlEncode(JSON.stringify(body));
  const data = `${head}.${pl}`;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${b64urlEncode(sig)}`;
}

export async function verifyJWT<T = any>(token: string, secret: string): Promise<T | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const key = await hmacKey(secret);
  const ok = await crypto.subtle.verify(
    "HMAC", key, b64urlDecode(s) as BufferSource, new TextEncoder().encode(`${h}.${p}`)
  );
  if (!ok) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(p)));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload as T;
  } catch { return null; }
}

export async function getAuth(req: Request, secret: string): Promise<{ username: string } | null> {
  const a = req.headers.get("Authorization") || "";
  if (!a.startsWith("Bearer ")) return null;
  const tok = a.slice(7).trim();
  const p = await verifyJWT<{ username: string }>(tok, secret);
  return p ? { username: p.username } : null;
}
