import { err, json, type Env } from "../_lib/types";
import { getAuth } from "../_lib/jwt";
import { ghDeleteFile, ghGetFile, safeFilename, userFilePath } from "../_lib/github";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(request, env.JWT_SECRET);
  if (!auth) return err("Unauthorized", 401);
  let body: any;
  try { body = await request.json(); } catch { return err("Invalid JSON"); }
  const name = safeFilename(String(body?.name || ""));
  let sha = String(body?.sha || "");
  if (!name) return err("Missing name");

  const path = userFilePath(auth.username, name);
  if (!sha) {
    const existing = await ghGetFile(env, path);
    if (!existing) return err("File not found", 404);
    sha = existing.sha;
  }
  await ghDeleteFile(env, path, sha, `Delete ${name} by ${auth.username}`);
  return json({ ok: true });
};
