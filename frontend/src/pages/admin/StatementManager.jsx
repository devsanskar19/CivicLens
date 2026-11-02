import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const blank = {politician:"",statement:"",topic:"General",platform:"",originalUrl:"",evidenceUrl:"",publishedOn:"",analysis:"",status:"draft"};

export default function StatementManager() {
  const [people,setPeople] = useState([]);
  const [items,setItems] = useState([]);
  const [form,setForm] = useState(blank);
  const [editing,setEditing] = useState("");
  const [message,setMessage] = useState("");
  async function load(){try{const [p,s]=await Promise.all([api.get("/politicians/admin/all"),api.get("/statements/admin/all")]);setPeople(p.data.items);setItems(s.data.items);}catch(e){setMessage(e.response?.data?.message||"Could not load statements.");}}
  useEffect(()=>{load();},[]);
  async function submit(e){e.preventDefault();setMessage("");try{const payload={...form,publishedOn:form.publishedOn||null};if(editing)await api.put(`/statements/${editing}`,payload);else await api.post("/statements",payload);setForm(blank);setEditing("");setMessage("Statement saved.");load();}catch(e){setMessage(e.response?.data?.message||"Could not save statement.");}}
  function edit(s){setEditing(s._id);setForm({politician:s.politician?._id||s.politician||"",statement:s.statement,topic:s.topic||"General",platform:s.platform||"",originalUrl:s.originalUrl||"",evidenceUrl:s.evidenceUrl||"",publishedOn:s.publishedOn?new Date(s.publishedOn).toISOString().slice(0,10):"",analysis:s.analysis||"",status:s.status||"draft"});}
  async function remove(id){if(!window.confirm("Delete this statement?"))return;try{await api.delete(`/statements/${id}`);load();}catch(e){setMessage(e.response?.data?.message||"Delete failed.");}}
  return <section className="admin-section narrow-admin"><Link to="/admin" className="back-link">← Dashboard</Link><span className="section-kicker">PUBLIC STATEMENT ARCHIVE</span><h1>Manage statements</h1>{message&&<div className="notice">{message}</div>}
    <form className="editor-form" onSubmit={submit}><h2>{editing?"Edit statement":"Add public statement"}</h2><label>Politician<select required value={form.politician} onChange={e=>setForm({...form,politician:e.target.value})}><option value="">Choose a profile</option>{people.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}</select></label><label>Statement / summary<textarea rows="4" required value={form.statement} onChange={e=>setForm({...form,statement:e.target.value})}/></label><div className="form-row"><label>Topic<input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})}/></label><label>Platform<input value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} placeholder="X, Instagram, official website…"/></label></div><label>Original public post URL<input type="url" value={form.originalUrl} onChange={e=>setForm({...form,originalUrl:e.target.value})}/></label><label>Supporting evidence URL<input type="url" value={form.evidenceUrl} onChange={e=>setForm({...form,evidenceUrl:e.target.value})}/></label><label>Original publication date<input type="date" value={form.publishedOn} onChange={e=>setForm({...form,publishedOn:e.target.value})}/></label><label>Research notes / context<textarea rows="4" value={form.analysis} onChange={e=>setForm({...form,analysis:e.target.value})}/></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="draft">Draft</option><option value="published">Published</option></select></label><div className="form-actions"><button className="button">{editing?"Update statement":"Save statement"}</button>{editing&&<button type="button" className="button button-outline" onClick={()=>{setEditing("");setForm(blank);}}>Cancel edit</button>}</div></form>
    <h2 className="list-title">Existing statements</h2>{items.map(s=><div className="manage-row" key={s._id}><div><b>{s.politician?.name||"Representative"}: {s.statement.slice(0,90)}</b><span>{s.status} · {s.topic}</span></div><button onClick={()=>edit(s)}>Edit</button><button className="danger-text" onClick={()=>remove(s._id)}>Delete</button></div>)}
  </section>;
}
