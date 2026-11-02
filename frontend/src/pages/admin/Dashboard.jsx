import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FilePlus2, Users, MessageSquareText, LogOut, FileText, Pencil, Trash2, Eye } from "lucide-react";
import api from "../../api";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function load() {
    try { const { data } = await api.get("/content/admin/all"); setItems(data.items); }
    catch (e) { setError(e.response?.data?.message || "Could not load dashboard."); if (e.response?.status === 401) logout(); }
  }
  useEffect(() => { load(); }, []);
  function logout() {
    localStorage.removeItem("civiclens_admin_token"); localStorage.removeItem("civiclens_admin_name"); navigate("/admin/login");
  }
  async function remove(id) {
    if (!window.confirm("Delete this content permanently?")) return;
    try { await api.delete(`/content/${id}`); load(); } catch (e) { setError(e.response?.data?.message || "Delete failed."); }
  }
  const published = items.filter(x=>x.status==="published").length;
  return <section className="admin-section">
    <div className="admin-heading"><div><span className="section-kicker">EDITORIAL CONTROL ROOM</span><h1>Admin dashboard</h1><p>Welcome, {localStorage.getItem("civiclens_admin_name") || "Administrator"}.</p></div><button className="button button-outline" onClick={logout}><LogOut size={16}/> Sign out</button></div>
    {error && <div className="notice error">{error}</div>}
    <div className="stats-grid"><div className="stat-card"><FileText/><strong>{items.length}</strong><span>Total content items</span></div><div className="stat-card"><Eye/><strong>{published}</strong><span>Published</span></div><div className="stat-card"><Pencil/><strong>{items.length-published}</strong><span>Drafts</span></div></div>
    <div className="admin-actions">
      <Link to="/admin/content/new" className="admin-action"><FilePlus2/><b>New content</b><span>Create a fact-check or report</span></Link>
      <Link to="/admin/politicians" className="admin-action"><Users/><b>Politicians</b><span>Manage public profiles</span></Link>
      <Link to="/admin/statements" className="admin-action"><MessageSquareText/><b>Statements</b><span>Archive public statements</span></Link>
    </div>
    <div className="admin-table-wrap"><div className="table-heading"><h2>Content management</h2><Link className="button" to="/admin/content/new">+ Create content</Link></div>
      {items.length ? <div className="table-scroll"><table><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{items.map(item=><tr key={item._id}><td><b>{item.title}</b></td><td>{item.type}</td><td><span className={`status status-${item.status}`}>{item.status}</span></td><td>{new Date(item.updatedAt).toLocaleDateString()}</td><td className="actions-cell"><Link to={`/admin/content/${item._id}`} aria-label="Edit"><Pencil size={17}/></Link><button onClick={()=>remove(item._id)} aria-label="Delete"><Trash2 size={17}/></button></td></tr>)}</tbody></table></div> : <div className="empty-state"><h3>No content created yet.</h3><p>Create your first investigation using the button above.</p></div>}
    </div>
  </section>;
}
