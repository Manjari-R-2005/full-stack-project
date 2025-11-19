import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Profile(){
  const { user, setUser } = useApp()
  const [form, setForm] = useState(()=> user || { name:'', email:'', phone:'' })

  const save = (e)=>{
    e.preventDefault()
    setUser(form)
  }

  return (
    <section className="section">
      <div className="container" style={{maxWidth:720}}>
        <h2 style={{marginTop:0}}>Profile</h2>
        <form className="glass card" onSubmit={save}>
          <label className="label">Full Name</label>
          <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
          <label className="label" style={{marginTop:10}}>Email</label>
          <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
          <label className="label" style={{marginTop:10}}>Phone</label>
          <input className="input" value={form.phone||''} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <button className="btn btn-gradient" style={{marginTop:14, width:180}}>Save Changes</button>
        </form>
      </div>
    </section>
  )
}
