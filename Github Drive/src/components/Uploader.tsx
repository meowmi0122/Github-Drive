import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "../lib/auth";
import { IconUpload, IconCheck, IconWarn, IconSpinner, IconCopy } from "./Icons";

type Status = "idle" | "uploading" | "success" | "error";

export default function Uploader({ onDone }: { onDone: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [rawUrl, setRawUrl] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick() { inputRef.current?.click(); }

  function upload(file: File) {
    const s = getSession();
    if (!s) return;
    setStatus("uploading"); setProgress(0); setMessage(file.name); setRawUrl("");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("Authorization", `Bearer ${s.token}`);
    xhr.setRequestHeader("X-Filename", encodeURIComponent(file.name));
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setRawUrl(data.rawUrl || "");
          setStatus("success");
          onDone();
        } catch { setStatus("error"); setMessage("Bad response"); }
      } else {
        setStatus("error");
        try { setMessage(JSON.parse(xhr.responseText).error || "Upload failed"); }
        catch { setMessage("Upload failed"); }
      }
    };
    xhr.onerror = () => { setStatus("error"); setMessage("Network error"); };
    xhr.send(file);
  }

  function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    upload(files[0]);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      className={"glass rounded-3xl p-8 text-center transition border-2 border-dashed " +
        (drag ? "border-white/40 bg-white/10" : "border-white/10")}
    >
      <input ref={inputRef} type="file" hidden onChange={(e) => handleFiles(e.target.files)} />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
              <IconUpload width={26} height={26} />
            </div>
            <div className="mt-4 font-medium">Drop a file here, or</div>
            <button className="btn-primary mt-3" onClick={pick}>Choose file</button>
            <div className="mt-2 text-xs text-white/40">Max ~90 MB per file (GitHub limit)</div>
          </motion.div>
        )}

        {status === "uploading" && (
          <motion.div key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <IconSpinner /> Uploading {message}
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full bg-white" animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} />
            </div>
            <div className="mt-2 text-sm text-white/60">{progress}%</div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <IconCheck width={26} height={26} />
            </div>
            <div className="mt-3 font-medium">Uploaded</div>
            {rawUrl && (
              <div className="mt-3 flex items-center gap-2 max-w-xl mx-auto">
                <input className="input text-xs" readOnly value={rawUrl} />
                <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(rawUrl)}>
                  <IconCopy /> Copy
                </button>
              </div>
            )}
            <button className="btn-ghost mt-4" onClick={() => setStatus("idle")}>Upload another</button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/20 text-red-300 flex items-center justify-center">
              <IconWarn width={26} height={26} />
            </div>
            <div className="mt-3 text-red-300">{message || "Upload failed"}</div>
            <button className="btn-ghost mt-4" onClick={() => setStatus("idle")}>Try again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
