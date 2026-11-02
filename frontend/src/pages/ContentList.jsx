import { useEffect, useState } from "react";
import api from "../api";
import ContentCard from "../components/ContentCard";

export default function ContentList({ type, title }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/content", { params: { type } }).then(({ data }) => setItems(data.items)).catch(() => setError("Unable to load content. Please try again later."));
  }, [type]);
  return <section className="section page-section">
    <span className="section-kicker">CIVICLENS DESK</span><h1 className="page-title">{title}</h1>
    <p className="page-intro">{type === "factcheck" ? "Viral claims examined against evidence, primary documents and credible reporting." : type === "media-analysis" ? "Features examining political satire, memes, creators and the changing news environment." : "Research reports, survey findings and analysis of public communication."}</p>
    {error && <div className="notice error">{error}</div>}
    {items.length ? <div className="card-grid">{items.map(item => <ContentCard key={item._id} item={item}/>)}</div> : <div className="empty-state"><h3>No published articles yet.</h3><p>When the editorial team publishes content in this section, it will appear here.</p></div>}
  </section>;
}
