import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useApp } from '../context/AppContext'

export default function AdminDashboard(){
  const { events, bookings, addEvent, updateEvent, deleteEvent } = useApp()
  const [form, setForm] = useState({ name:'', category:'EDM', date:'', venue:'', image:'', price:{regular:1000, vip:2500, student:700}, description:'' })
  const [editing, setEditing] = useState(null)

  const salesData = useMemo(()=>{
    const byDate = {}
    bookings.forEach(b=>{ const d = new Date(b.createdAt).toLocaleDateString(); byDate[d] = (byDate[d]||0) + b.qty })
    return Object.entries(byDate).map(([date, qty])=>({ date, qty }))
  },[bookings])

  const startEdit = (e)=>{ setEditing(e.id); setForm({ ...e }) }
  const cancelEdit = ()=>{ setEditing(null); setForm({ name:'', category:'EDM', date:'', venue:'', image:'', price:{regular:1000, vip:2500, student:700}, description:'' }) }

  const onSubmit = (e)=>{
    e.preventDefault()
    if(editing){ updateEvent(editing, form) } else { addEvent(form) }
    cancelEdit()
  }

  const onPrice = (k, v)=> setForm(f=> ({...f, price:{...f.price, [k]: Number(v||0)}}))

  return (
    <section className="section">
      <div className="container">
        <h2 style={{marginTop:0}}>Admin Dashboard</h2>
        <div className="grid" style={{gridTemplateColumns:'1.2fr .8fr'}}>
          <div className="glass card">
            <h3 style={{marginTop:0}}>{editing? 'Edit Event' : 'Add Event'}</h3>
            <form className="grid" style={{gridTemplateColumns:'1fr 1fr'}} onSubmit={onSubmit}>
              <div>
                <label className="label">Name</label>
                <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                  {['EDM','Rock','Jazz','Pop','Hip-Hop','Indie'].map(c=> <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required/>
              </div>
              <div>
                <label className="label">Venue</label>
                <input className="input" value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} required/>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input className="input" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} required/>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
              </div>

              <div>
                <label className="label">Regular</label>
                <input className="input" type="number" value={form.price.regular} onChange={e=>onPrice('regular', e.target.value)}/>
              </div>
              <div>
                <label className="label">VIP</label>
                <input className="input" type="number" value={form.price.vip} onChange={e=>onPrice('vip', e.target.value)}/>
              </div>
              <div>
                <label className="label">Student</label>
                <input className="input" type="number" value={form.price.student} onChange={e=>onPrice('student', e.target.value)}/>
              </div>

              <div className="row" style={{gridColumn:'1 / -1'}}>
                <button className="btn btn-gradient" type="submit">{editing? 'Update' : 'Add'} Event</button>
                {editing && <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="glass card">
            <h3 style={{marginTop:0}}>Ticket Sales</h3>
            <div style={{height:260}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid stroke="rgba(255,255,255,.08)" />
                  <XAxis dataKey="date" stroke="#B8B8B8"/>
                  <YAxis stroke="#B8B8B8"/>
                  <Tooltip contentStyle={{background:'rgba(20,20,20,.9)', border:'1px solid rgba(255,255,255,.12)'}}/>
                  <Line type="monotone" dataKey="qty" stroke="#6C63FF" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass card" style={{marginTop:16}}>
          <h3 style={{marginTop:0}}>Manage Events</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th><th>Date</th><th>Venue</th><th>Category</th><th></th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.date}</td>
                  <td>{e.venue}</td>
                  <td>{e.category}</td>
                  <td className="row">
                    <button className="btn btn-outline" onClick={()=>startEdit(e)}>Edit</button>
                    <button className="btn btn-outline" onClick={()=>deleteEvent(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
