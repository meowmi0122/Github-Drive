import { err, json, type Env } from "../_lib/types";
import { getAuth } from "../_lib/jwt";
import { ghGetFile, ghPutFile, bytesToBase64, rawUrl, safeFilename, userFilePath } from "../_lib/github";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(request, env.JWT_SECRET);
  if (!auth) return err("Unauthorized", 401);

  const rawName = decodeURIComponent(request.headers.get("X-Filename") || "");
  if (!rawName) return err("Missing X-Filename header");
  const filename = safeFilename(rawName);
  if (!filename) return err("Invalid filename");

  const buf = await request.arrayBuffer();
  if (buf.byteLength === 0) return err("Empty file");
  if (buf.byteLength > 95 * 1024 * 1024) return err("File too large (max ~95MB for GitHub)", 413);

  const path = userFilePath(auth.username, filename);
  const existing = await ghGetFile(env, path);
  const b64 = bytesToBase64(new Uint8Array(buf));
  await ghPutFile(env, path, b64, `Upload ${filename} by ${auth.username}`, existing?.sha);

  return json({
    name: filename,
    size: buf.byteLength,
    rawUrl: rawUrl(env, path)
  });
};
