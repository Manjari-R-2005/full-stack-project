import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api, setAuth } from '../utils/api'
import { ADMIN_EMAIL } from '../components/RouteGuards'

export default function Login(){
  const { setUser } = useApp()
  const [form, setForm] = useState({ email:'', password:'' })
  const navigate = useNavigate()

  const submit = (e)=>{
    e.preventDefault()
    ;(async ()=>{
      try{
        const res = await api.login(form.email, form.password)
        // expected: { token, user: { name, email, ... } }
        const u = res?.user || { name: form.email.split('@')[0], email: form.email }
        setAuth({ token: res?.token, user: u })
        setUser(u)
        if(u.email === ADMIN_EMAIL){
          navigate('/admin', { replace:true })
        }else{
          navigate('/dashboard', { replace:true })
        }
      }catch(err){
        alert('Login failed. Please check your credentials.')
      }
    })()
  }

  return (
    <section className="section center" style={{minHeight:'70vh'}}>
      <div className="container" style={{maxWidth:520}}>
        <div className="glass card" style={{padding:24}}>
          <h2 className="gradient-text" style={{textAlign:'center', marginTop:0}}>ConcertHub</h2>
          <form onSubmit={submit}>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
            <label className="label" style={{marginTop:10}}>Password</label>
            <input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
            <button className="btn btn-gradient" style={{marginTop:16, width:'100%'}}>Login</button>
            <div className="row" style={{justifyContent:'space-between', marginTop:10}}>
              <Link to="/forgot" className="link">Forgot Password?</Link>
              <Link to="/signup" className="link">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
