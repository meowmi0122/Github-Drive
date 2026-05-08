// Password hashing using scrypt-js (pure JS, Workers-compatible).
import { scrypt } from "scrypt-js";

const N = 16384, r = 8, p = 1, dkLen = 32;

function bytesToHex(b: Uint8Array): string {
  return Array.from(b).map(x => x.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(h: string): Uint8Array {
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.substr(i * 2, 2), 16);
  return out;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const pw = new TextEncoder().encode(password.normalize("NFKC"));
  const dk = await scrypt(pw, salt, N, r, p, dkLen);
  return `scrypt$${N}$${r}$${p}$${bytesToHex(salt)}$${bytesToHex(dk)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [scheme, n, rr, pp, saltHex, hashHex] = stored.split("$");
    if (scheme !== "scrypt") return false;
    const salt = hexToBytes(saltHex);
    const expected = hexToBytes(hashHex);
    const pw = new TextEncoder().encode(password.normalize("NFKC"));
    const dk = await scrypt(pw, salt, parseInt(n), parseInt(rr), parseInt(pp), expected.length);
    if (dk.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < dk.length; i++) diff |= dk[i] ^ expected[i];
    return diff === 0;
  } catch { return false; }
}
