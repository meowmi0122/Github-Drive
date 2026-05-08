import { useEffect, useState } from "react";

export type Session = { token: string; username: string };

const KEY = "ghdrive_session";

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch { return null; }
}
export function setSession(s: Session) { localStorage.setItem(KEY, JSON.stringify(s)); }
export function clearSession() { localStorage.removeItem(KEY); }

export function useAuth() {
  const [user, setUser] = useState<Session | null>(() => getSession());
  useEffect(() => {
    const onStorage = () => setUser(getSession());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return {
    user,
    login: (s: Session) => { setSession(s); setUser(s); },
    logout: () => { clearSession(); setUser(null); }
  };
}

export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const s = getSession();
  const headers = new Headers(opts.headers || {});
  if (s) headers.set("Authorization", `Bearer ${s.token}`);
  if (opts.body && !(opts.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(path, { ...opts, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && data.error) || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data as T;
}
