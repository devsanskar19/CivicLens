import { Outlet, Link, NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Layout() {
  return (
    <>
      <div className="topline">INDEPENDENT STUDENT-LED MEDIA LITERACY & RESEARCH</div>
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark"><ShieldCheck size={23} /></span>
          <span>CIVIC<span className="brand-accent">LENS</span><small>QUESTION. INVESTIGATE. VERIFY.</small></span>
        </Link>
        <nav className="main-nav">
          <NavLink to="/fact-checks">Fact Checks</NavLink>
          <NavLink to="/media-analysis">Satire vs News</NavLink>
          <NavLink to="/research">Research</NavLink>
          <NavLink to="/politicians">Politician Tracker</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <Link className="admin-link" to="/admin/login">Admin Login</Link>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="footer-inner">
          <div><div className="footer-brand">CIVICLENS</div><p>Question. Investigate. Verify.</p></div>
          <p>Independent student-led research. Evidence first. Corrections welcome.</p>
          <span>© {new Date().getFullYear()} CivicLens</span>
        </div>
      </footer>
    </>
  );
}
