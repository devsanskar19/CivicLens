import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import api from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (localStorage.getItem("civiclens_admin_token")) return <Navigate to="/admin" replace />;
  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("civiclens_admin_token", data.token);
      localStorage.setItem("civiclens_admin_name", data.admin.name);
      navigate("/admin");
    } catch (err) { setError(err.response?.data?.message || "Login failed. Check that the backend is running."); }
    finally { setLoading(false); }
  }
  return <section className="login-wrap"><form className="login-card" onSubmit={submit}><div className="login-icon"><LockKeyhole/></div><span className="section-kicker">RESTRICTED ACCESS</span><h1>Admin sign in</h1><p>This area is for authorised CivicLens administrators only.</p>
    {error && <div className="notice error">{error}</div>}
    <label>Admin email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>
    <button className="button full-button" disabled={loading}>{loading ? "Signing in…" : "Sign in securely"}</button>
    <small>Admin accounts are created by the project owner using the backend setup script. There is no public sign-up.</small>
  </form></section>;
}
