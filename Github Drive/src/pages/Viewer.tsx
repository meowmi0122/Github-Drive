import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/auth";
import { fileKind } from "../lib/format";
import { IconCopy, IconDownload, IconExternal, IconSpinner, IconWarn, IconFile } from "../components/Icons";

type Info = { name: string; size: number; rawUrl: string };

export default function Viewer() {
  const { name } = useParams();
  const [info, setInfo] = useState<Info | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api<Info>(`/api/file?name=${encodeURIComponent(name || "")}`);
        setInfo(res);
        if (fileKind(res.name) === "text") {
          const r = await fetch(res.rawUrl);
          setText(await r.text());
        }
      } catch (e: any) { setErr(e.message); }
    })();
  }, [name]);

  if (err) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-2xl p-6 text-red-300 flex items-center gap-2"><IconWarn /> {err}</div>
    </div>
  );
  if (!info) return (
    <div className="min-h-screen flex items-center justify-center text-white/60"><IconSpinner /> Loading...</div>
  );

  const k = fileKind(info.name);

  return (
    <div className="min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between glass-strong border-b border-white/10">
        <Link to="/dashboard" className="btn-ghost">← Back</Link>
        <div className="truncate font-medium px-4">{info.name}</div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(info.rawUrl)}>
            <IconCopy width={16} height={16} /> Copy URL
          </button>
          <a className="btn-ghost" href={info.rawUrl} target="_blank" rel="noreferrer">
            <IconExternal width={16} height={16} /> Open
          </a>
          <a className="btn-primary" href={info.rawUrl} download={info.name}>
            <IconDownload width={16} height={16} /> Download
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="glass rounded-2xl p-4">
          {k === "image" && <img src={info.rawUrl} alt={info.name} className="max-w-full mx-auto rounded-xl" />}
          {k === "video" && <video src={info.rawUrl} controls className="w-full rounded-xl" />}
          {k === "audio" && <audio src={info.rawUrl} controls className="w-full" />}
          {k === "pdf" && <iframe src={info.rawUrl} className="w-full h-[80vh] rounded-xl bg-white" title={info.name} />}
          {k === "html" && <iframe src={info.rawUrl} sandbox="" className="w-full h-[80vh] rounded-xl bg-white" title={info.name} />}
          {k === "text" && (
            <pre className="text-xs leading-relaxed whitespace-pre-wrap break-words p-4 bg-black/40 rounded-xl max-h-[80vh] overflow-auto">
              {text ?? "Loading..."}
            </pre>
          )}
          {k === "other" && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto"><IconFile width={28} height={28} /></div>
              <div className="mt-4 text-white/70">Preview not available for this file type.</div>
              <a className="btn-primary mt-4 inline-flex" href={info.rawUrl} download={info.name}>
                <IconDownload width={16} height={16} /> Download
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
