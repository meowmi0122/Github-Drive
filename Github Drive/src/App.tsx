import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Viewer from "./pages/Viewer";
import { useAuth } from "./lib/auth";

function Protected({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/view/:name" element={<Protected><Viewer /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
