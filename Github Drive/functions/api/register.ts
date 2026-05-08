import { err, json, type Env } from "../_lib/types";
import { hashPassword } from "../_lib/password";
import { ghGetFile, ghPutFile, userMetaPath, userFilePath, validUsername, bytesToBase64 } from "../_lib/github";
import { signJWT } from "../_lib/jwt";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: any;
  try { body = await request.json(); } catch { return err("Invalid JSON"); }
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");
  if (!validUsername(username)) return err("Invalid username (2-32 chars, a-z A-Z 0-9 _ -)");
  if (password.length < 6 || password.length > 128) return err("Password must be 6-128 chars");

  const existing = await ghGetFile(env, userMetaPath(username));
  if (existing) return err("Username already taken", 409);

  const hash = await hashPassword(password);
  const meta = { username, passwordHash: hash, createdAt: new Date().toISOString() };
  const metaB64 = bytesToBase64(new TextEncoder().encode(JSON.stringify(meta, null, 2)));
  await ghPutFile(env, userMetaPath(username), metaB64, `Create user ${username}`);

  // Seed files/.gitkeep so the folder exists
  const keepB64 = bytesToBase64(new TextEncoder().encode(""));
  await ghPutFile(env, userFilePath(username, ".gitkeep"), keepB64, `Init files for ${username}`);

  const token = await signJWT({ username }, env.JWT_SECRET);
  return json({ token, username });
};
