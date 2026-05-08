import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconGithub, IconFolder, IconUpload, IconEye } from "../components/Icons";
import { useAuth } from "../lib/auth";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <IconGithub width={22} height={22} />
          <span>GitHub Drive</span>
        </div>
        <nav className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard" className="btn-primary">Open Dashboard</Link>
          ) : (
            <>
              <Link to="/auth" className="btn-ghost">Sign in</Link>
              <Link to="/auth?mode=register" className="btn-primary">Get started</Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-semibold tracking-tight">
            Your personal cloud,<br />
            <span className="text-white/60">powered by GitHub.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="mt-6 text-white/60 text-lg">
            Upload, preview, and share files with permanent RAW URLs. Minimal, fast, and private.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <IconUpload />, title: "Drag & Drop", text: "Upload anything with a smooth progress UI." },
              { icon: <IconFolder />, title: "Your repo, your data", text: "Files live in your own GitHub repository." },
              { icon: <IconEye />,  title: "Instant preview", text: "Images, video, audio, PDF, code & HTML." }
            ].map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}
                className="glass rounded-2xl p-5 text-left">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">{f.icon}</div>
                <div className="font-medium">{f.title}</div>
                <div className="text-sm text-white/60 mt-1">{f.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-white/40 text-sm">
        Built with React · Cloudflare Functions · GitHub
      </footer>
    </div>
  );
}
