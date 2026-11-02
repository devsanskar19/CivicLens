import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Politicians() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/politicians").then(({ data }) => setItems(data.items)).catch(() => {}); }, []);
  return <section className="section page-section"><span className="section-kicker">PUBLIC COMMUNICATION</span><h1 className="page-title">Politician tracker</h1><p className="page-intro">Profiles of public representatives and documented public communication. Entries should be supported by original public sources.</p>
    {items.length ? <div className="people-grid">{items.map(p => <div className="person-card" key={p._id}>{p.imageUrl ? <img src={p.imageUrl} alt="" /> : <div className="person-placeholder">{p.name.slice(0,1)}</div>}<div><h3>{p.name}</h3><p>{[p.role,p.constituency,p.party].filter(Boolean).join(" · ")}</p>{p.bio && <p>{p.bio}</p>}<Link to={`/statements?politician=${p._id}`}>View public statements →</Link></div></div>)}</div> : <div className="empty-state"><h3>No profiles published yet.</h3><p>Public representative profiles added by the research team will appear here.</p></div>}
  </section>;
}
