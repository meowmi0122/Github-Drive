import { err, json, type Env } from "../_lib/types";
import { getAuth } from "../_lib/jwt";
import { ghListDir, rawUrl, userFilesDir } from "../_lib/github";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(request, env.JWT_SECRET);
  if (!auth) return err("Unauthorized", 401);
  const items = await ghListDir(env, userFilesDir(auth.username));
  const files = items
    .filter(i => i.type === "file" && i.name !== ".gitkeep")
    .map(i => ({
      name: i.name,
      size: i.size,
      sha: i.sha,
      rawUrl: rawUrl(env, i.path)
    }));
  return json({ files });
};
