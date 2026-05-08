import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fileKind, humanSize } from "../lib/format";
import { IconFile, IconImage, IconVideo, IconMusic, IconCode, IconCopy, IconExternal, IconTrash, IconEye } from "./Icons";

export type FileItem = { name: string; size: number; rawUrl: string; sha: string };

function KindIcon({ name }: { name: string }) {
  const k = fileKind(name);
  if (k === "image") return <IconImage />;
  if (k === "video") return <IconVideo />;
  if (k === "audio") return <IconMusic />;
  if (k === "text" || k === "html") return <IconCode />;
  return <IconFile />;
}

export default function FileCard({ file, onDelete }: { file: FileItem; onDelete: (f: FileItem) => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 flex flex-col gap-3 group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <KindIcon name={file.name} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium" title={file.name}>{file.name}</div>
          <div className="text-xs text-white/50">{humanSize(file.size)}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className="btn-ghost text-xs !px-3 !py-1.5" to={`/view/${encodeURIComponent(file.name)}`}>
          <IconEye width={16} height={16} /> Preview
        </Link>
        <button className="btn-ghost text-xs !px-3 !py-1.5"
          onClick={() => navigator.clipboard.writeText(file.rawUrl)}>
          <IconCopy width={16} height={16} /> Copy
        </button>
        <a className="btn-ghost text-xs !px-3 !py-1.5" href={file.rawUrl} target="_blank" rel="noreferrer">
          <IconExternal width={16} height={16} /> Open
        </a>
        <button className="btn-ghost text-xs !px-3 !py-1.5 ml-auto text-red-300 hover:text-red-200"
          onClick={() => onDelete(file)}>
          <IconTrash width={16} height={16} />
        </button>
      </div>
    </motion.div>
  );
}
