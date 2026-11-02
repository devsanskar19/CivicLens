import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";

export default function Statements() {
  const [params] = useSearchParams();
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/statements", { params: params.get("politician") ? { politician: params.get("politician") } : {} }).then(({ data }) => setItems(data.items)).catch(() => {}); }, [params]);
  return <section className="section page-section"><span className="section-kicker">PUBLIC RECORD</span><h1 className="page-title">Statement archive</h1><p className="page-intro">A documented archive of public statements, with original links and research context where available.</p>
    {items.length ? <div className="statement-list">{items.map(s => <article className="statement-card" key={s._id}><div className="eyebrow">{s.topic}</div><h3>{s.politician?.name || "Public representative"}</h3><blockquote>{s.statement}</blockquote><p>{s.analysis}</p><div className="card-meta">{s.platform} {s.publishedOn ? `· ${new Date(s.publishedOn).toLocaleDateString()}` : ""}</div>{s.originalUrl && <a href={s.originalUrl} target="_blank" rel="noreferrer">Original public post ↗</a>}{s.evidenceUrl && <a href={s.evidenceUrl} target="_blank" rel="noreferrer">Supporting evidence ↗</a>}</article>)}</div> : <div className="empty-state"><h3>No statements published yet.</h3><p>Documented public statements will appear here after editorial review.</p></div>}
  </section>;
}
