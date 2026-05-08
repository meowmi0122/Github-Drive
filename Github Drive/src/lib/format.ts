export function humanSize(bytes: number): string {
  if (!bytes) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0; let n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
}

export function fileKind(name: string): "image" | "video" | "audio" | "pdf" | "text" | "html" | "other" {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["png","jpg","jpeg","gif","webp","svg","bmp","ico","avif"].includes(ext)) return "image";
  if (["mp4","webm","mov","mkv","m4v"].includes(ext)) return "video";
  if (["mp3","wav","ogg","flac","m4a","aac"].includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (["html","htm"].includes(ext)) return "html";
  if (["txt","md","json","js","ts","tsx","jsx","css","py","go","rs","java","c","cpp","h","yml","yaml","xml","csv","log","sh"].includes(ext)) return "text";
  return "other";
}
