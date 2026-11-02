import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, SearchCheck, MessagesSquare, BarChart3 } from "lucide-react";
import api from "../api";
import ContentCard from "../components/ContentCard";

export default function Home() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/content").then(({ data }) => setItems(data.items.slice(0, 6))).catch(() => setError("Could not load articles. Check that the backend is running."));
  }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-kicker"><span className="pulse-dot"></span> INDEPENDENT STUDENT RESEARCH DESK</div>
          <h1>Know what's<br /><em>behind the claim.</em></h1>
          <p>We examine viral political claims, explore how digital media shapes public understanding, and document public political communication through evidence-led research.</p>
          <div className="hero-actions"><Link className="button button-light" to="/fact-checks">Explore fact checks <ArrowRight size={17} /></Link><Link className="text-link light-link" to="/about">Our methodology</Link></div>
          <div className="hero-note">NO PARTY LINE. NO RUMOUR MILL. JUST SOURCES, CONTEXT AND TRANSPARENCY.</div>
        </div>
        <div className="hero-side"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="hero-symbol"><SearchCheck size={76} strokeWidth={1.1}/></div><span>VERIFY<br/>BEFORE YOU<br/>AMPLIFY.</span></div>
      </section>
      <section className="principles">
        <div><SearchCheck /><h3>Verify claims</h3><p>Investigate viral claims using traceable evidence and original sources.</p></div>
        <div><MessagesSquare /><h3>Study discourse</h3><p>Understand how satire, creators and traditional media shape public debate.</p></div>
        <div><BarChart3 /><h3>Publish research</h3><p>Present surveys, public records and political communication analysis clearly.</p></div>
      </section>
      <section className="section">
        <div className="section-heading"><div><span className="section-kicker">THE NEWSROOM</span><h2>Latest investigations</h2></div><Link className="read-link" to="/fact-checks">Browse all content →</Link></div>
        {error && <div className="notice error">{error}</div>}
        {items.length ? <div className="card-grid">{items.map(item => <ContentCard key={item._id} item={item}/>)}</div> : !error && <div className="empty-state"><h3>The newsroom is getting ready.</h3><p>Published investigations will appear here. Admins can sign in to add the first report.</p><Link className="button" to="/admin/login">Admin login</Link></div>}
      </section>
      <section className="callout"><div><span className="section-kicker">OUR COMMITMENT</span><h2>Evidence before opinion.</h2><p>Every investigation should show what was claimed, what we checked, what the evidence says and where readers can verify it themselves.</p></div><Link className="button button-light" to="/about">Read our principles <ArrowRight size={16}/></Link></section>
    </>
  );
}
