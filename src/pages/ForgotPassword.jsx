import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const submit = (e)=>{
    e.preventDefault(); setSent(true)
    setTimeout(()=> navigate('/reset?email='+encodeURIComponent(email)), 800)
  }

  return (
    <section className="section center" style={{minHeight:'70vh'}}>
      <div className="container" style={{maxWidth:520}}>
        <div className="glass card" style={{padding:24}}>
          <h2 className="gradient-text" style={{textAlign:'center', marginTop:0}}>Reset Access</h2>
          {!sent ? (
            <form onSubmit={submit}>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
              <button className="btn btn-gradient" style={{marginTop:16, width:'100%'}}>Send OTP</button>
            </form>
          ) : (
            <div className="center" style={{minHeight:140, textAlign:'center'}}>
              <div>
                <h3>OTP sent</h3>
                <div className="muted">Check your email and continue to reset.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
