import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function ResetPassword(){
  const [params] = useSearchParams()
  const email = params.get('email') || ''
  const [otp, setOtp] = useState('')
  const [pass, setPass] = useState('')
  const [ok, setOk] = useState(false)
  const navigate = useNavigate()

  const submit = (e)=>{
    e.preventDefault(); setOk(true)
    setTimeout(()=> navigate('/login'), 900)
  }

  return (
    <section className="section center" style={{minHeight:'70vh'}}>
      <div className="container" style={{maxWidth:520}}>
        <div className="glass card" style={{padding:24}}>
          <h2 className="gradient-text" style={{textAlign:'center', marginTop:0}}>Verify & Reset</h2>
          {!ok ? (
            <form onSubmit={submit}>
              <div className="muted" style={{marginBottom:10}}>Email: {email}</div>
              <label className="label">OTP</label>
              <input className="input" value={otp} onChange={e=>setOtp(e.target.value)} required/>
              <label className="label" style={{marginTop:10}}>New Password</label>
              <input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} required/>
              <button className="btn btn-gradient" style={{marginTop:16, width:'100%'}}>Reset Password</button>
            </form>
          ) : (
            <div className="center" style={{minHeight:140, textAlign:'center'}}>
              <div>
                <h3>Password updated</h3>
                <div className="muted">You can now login with your new password.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
