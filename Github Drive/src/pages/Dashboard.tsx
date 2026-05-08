import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api, useAuth } from "../lib/auth";
import { IconGithub, IconLogout, IconSearch, IconUser, IconSpinner } from "../components/Icons";
import Uploader from "../components/Uploader";
import FileCard, { FileItem } from "../components/FileCard";
import { humanSize } from "../lib/format";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true); setErr("");
    try {
      const res = await api<{ files: FileItem[] }>("/api/list");
      setFiles(res.files);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => files.filter(f => f.name.toLowerCase().includes(q.toLowerCase())),
    [files, q]
  );
  const total = files.reduce((a, b) => a + (b.size || 0), 0);

  async function del(f: FileItem) {
    if (!confirm(`Delete ${f.name}?`)) return;
    try {
      await api("/api/delete", { method: "POST", body: JSON.stringify({ name: f.name, sha: f.sha }) });
      setFiles(prev => prev.filter(x => x.name !== f.name));
    } catch (e: any) { alert(e.message); }
  }

  return (
    <div className="min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between glass-strong sticky top-0 z-10 border-b border-white/10">
        <div className="flex items-center gap-2 font-semibold">
          <IconGithub width={20} height={20} />
          <span>GitHub Drive</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-white/70">
            <IconUser width={16} height={16} /> {user?.username}
          </div>
          <button className="btn-ghost" onClick={() => { logout(); navigate("/"); }}>
            <IconLogout width={16} height={16} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-white/50">Files</div>
            <div className="text-2xl font-semibold mt-1">{files.length}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-white/50">Storage used</div>
            <div className="text-2xl font-semibold mt-1">{humanSize(total)}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-white/50">Account</div>
            <div className="text-2xl font-semibold mt-1 truncate">{user?.username}</div>
          </div>
        </motion.div>

        <Uploader onDone={load} />

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input className="input pl-10" placeholder="Search files..." value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <div className="text-sm text-white/50">{filtered.length} item(s)</div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-white/60"><IconSpinner /> Loading...</div>
          ) : err ? (
            <div className="text-red-300">{err}</div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-white/50">
              No files yet. Upload something above.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(f => <FileCard key={f.name} file={f} onDelete={del} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
