import { err, json, type Env } from "../_lib/types";
import { verifyPassword } from "../_lib/password";
import { ghGetFileRaw, userMetaPath, validUsername } from "../_lib/github";
import { signJWT } from "../_lib/jwt";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: any;
  try { body = await request.json(); } catch { return err("Invalid JSON"); }
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");
  if (!validUsername(username)) return err("無法取得用戶", 404);

  const raw = await ghGetFileRaw(env, userMetaPath(username));
  if (!raw) return err("無法取得用戶", 404);

  let meta: any;
  try { meta = JSON.parse(raw); } catch { return err("Corrupt user meta", 500); }

  const ok = await verifyPassword(password, meta.passwordHash);
  if (!ok) return err("密碼錯誤", 401);

  const token = await signJWT({ username }, env.JWT_SECRET);
  return json({ token, username });
};
