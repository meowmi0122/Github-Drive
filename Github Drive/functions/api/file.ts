import { err, json, type Env } from "../_lib/types";
import { getAuth } from "../_lib/jwt";
import { ghGetFile, rawUrl, safeFilename, userFilePath } from "../_lib/github";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(request, env.JWT_SECRET);
  if (!auth) return err("Unauthorized", 401);
  const url = new URL(request.url);
  const name = safeFilename(url.searchParams.get("name") || "");
  if (!name) return err("Missing name");
  const path = userFilePath(auth.username, name);
  const f = await ghGetFile(env, path);
  if (!f) return err("File not found", 404);
  return json({ name, size: f.size, rawUrl: rawUrl(env, path) });
};
