import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api, useAuth } from "../lib/auth";
import { IconGithub, IconUser, IconWarn, IconSpinner } from "../components/Icons";

export default function Auth() {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const res = await api<{ token: string; username: string }>(`/api/${mode}`, {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password })
      });
      login({ token: res.token, username: res.username });
      navigate("/dashboard");
    } catch (e: any) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong w-full max-w-md rounded-3xl p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <IconGithub width={22} height={22} />
          <span className="font-semibold">GitHub Drive</span>
        </div>
        <h1 className="text-2xl font-semibold text-center">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-center text-white/50 text-sm mt-1">
          {mode === "login" ? "Sign in to access your drive" : "Start uploading in seconds"}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="relative">
            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input className="input pl-10" placeholder="Username" value={username}
              onChange={e => setUsername(e.target.value)} required minLength={2} maxLength={32}
              pattern="[a-zA-Z0-9_\-]+" title="letters, numbers, _ -" />
          </div>
          <input className="input" type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={6} maxLength={128} />

          {err && (
            <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <IconWarn /> <span>{err}</span>
            </div>
          )}

          <button className="btn-primary w-full !py-3" disabled={loading}>
            {loading ? <IconSpinner /> : null}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-white/60">
          {mode === "login" ? (
            <>No account? <button className="text-white underline" onClick={() => setMode("register")}>Register</button></>
          ) : (
            <>Have one? <button className="text-white underline" onClick={() => setMode("login")}>Sign in</button></>
          )}
        </div>
        <div className="mt-2 text-center"><Link className="text-white/40 text-xs hover:text-white/70" to="/">← Back home</Link></div>
      </motion.div>
    </div>
  );
}
