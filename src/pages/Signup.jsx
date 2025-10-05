import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Signup(){
  const { setUser } = useApp()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const navigate = useNavigate()

  const submit = (e)=>{
    e.preventDefault()
    setUser({ name: form.name, email: form.email })
    navigate('/dashboard')
  }

  return (
    <section className="section center" style={{minHeight:'70vh'}}>
      <div className="container" style={{maxWidth:520}}>
        <div className="glass card" style={{padding:24}}>
          <h2 className="gradient-text" style={{textAlign:'center', marginTop:0}}>Create Account</h2>
          <form onSubmit={submit}>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
            <label className="label" style={{marginTop:10}}>Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
            <label className="label" style={{marginTop:10}}>Password</label>
            <input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
            <button className="btn btn-gradient" style={{marginTop:16, width:'100%'}}>Sign up</button>
            <div className="row" style={{justifyContent:'space-between', marginTop:10}}>
              <span className="muted">Already have an account?</span>
              <Link to="/login" className="link">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
