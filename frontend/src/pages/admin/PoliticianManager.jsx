import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const blank = {name:"",role:"",constituency:"",party:"",imageUrl:"",bio:"",status:"active"};

export default function PoliticianManager() {
  const [items,setItems] = useState([]);
  const [form,setForm] = useState(blank);
  const [editing,setEditing] = useState("");
  const [message,setMessage] = useState("");
  async function load(){try{const {data}=await api.get("/politicians/admin/all");setItems(data.items);}catch(e){setMessage(e.response?.data?.message||"Unable to load profiles.");}}
  useEffect(()=>{load();},[]);
  async function submit(e){e.preventDefault();setMessage("");try{if(editing)await api.put(`/politicians/${editing}`,form);else await api.post("/politicians",form);setForm(blank);setEditing("");setMessage("Profile saved.");load();}catch(e){setMessage(e.response?.data?.message||"Could not save profile.");}}
  function edit(p){setEditing(p._id);setForm({name:p.name,role:p.role||"",constituency:p.constituency||"",party:p.party||"",imageUrl:p.imageUrl||"",bio:p.bio||"",status:p.status||"active"});}
  async function remove(id){if(!window.confirm("Delete this profile?"))return;try{await api.delete(`/politicians/${id}`);load();}catch(e){setMessage(e.response?.data?.message||"Delete failed.");}}
  return <section className="admin-section narrow-admin"><Link to="/admin" className="back-link">← Dashboard</Link><span className="section-kicker">PUBLIC REPRESENTATIVE ARCHIVE</span><h1>Politician profiles</h1>{message&&<div className="notice">{message}</div>}
    <form className="editor-form" onSubmit={submit}><h2>{editing?"Edit profile":"Add profile"}</h2><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><div className="form-row"><label>Role<input value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/></label><label>Constituency / area<input value={form.constituency} onChange={e=>setForm({...form,constituency:e.target.value})}/></label></div><label>Party (optional)<input value={form.party} onChange={e=>setForm({...form,party:e.target.value})}/></label><label>Profile image URL<input type="url" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/></label><label>Short bio<textarea rows="3" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></label><label>Visibility<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="active">Public</option><option value="archived">Archived</option></select></label><div className="form-actions"><button className="button">{editing?"Update profile":"Add profile"}</button>{editing&&<button type="button" className="button button-outline" onClick={()=>{setEditing("");setForm(blank);}}>Cancel edit</button>}</div></form>
    <h2 className="list-title">Existing profiles</h2>{items.map(p=><div className="manage-row" key={p._id}><div><b>{p.name}</b><span>{p.role} · {p.status}</span></div><button onClick={()=>edit(p)}>Edit</button><button className="danger-text" onClick={()=>remove(p._id)}>Delete</button></div>)}
  </section>;
}
