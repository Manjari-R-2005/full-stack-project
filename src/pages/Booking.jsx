import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { currency } from '../utils/format'
import { generateReceipt } from '../utils/receipt'
import { sendBookingEmail } from '../utils/email'

export default function Booking(){
  const { id } = useParams()
  const { events, bookTickets, user: ctxUser } = useApp()
  const event = events.find(e => e.id === id)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [type, setType] = useState('regular')
  const [qty, setQty] = useState(1)
  const [user, setUser] = useState(()=> ctxUser || { name:'', email:'', phone:'' })
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number:'', name:'', expiry:'', cvv:'' })
  const [bookingId, setBookingId] = useState('')
  const [processing, setProcessing] = useState(false)

  const amount = useMemo(()=> event? (event.price[type] * qty) : 0, [event, type, qty])

  if(!event) return null

  const next = ()=> setStep(s => Math.min(4, s+1))
  const back = ()=> setStep(s => Math.max(1, s-1))

  const pay = async ()=>{
    setProcessing(true)
    // simulate processing delay
    await new Promise(r => setTimeout(r, 900))
    const idBk = bookTickets(id, type, qty, user, { amount, paymentMethod })
    setBookingId(idBk)
    // fire-and-forget email
    sendBookingEmail({ toEmail: user.email, event, bookingId: idBk, type, qty, amount }).catch(()=>{})
    setProcessing(false)
    next()
  }

  const download = ()=>{
    generateReceipt({ bookingId, event, user, type, qty, amount })
    navigate('/dashboard?success='+bookingId)
  }

  const Stepper = () => (
    <div className="glass card" style={{marginBottom:16}}>
      <div className="row" style={{justifyContent:'space-between'}}>
        {[1,2,3,4].map(i=> (
          <div key={i} className="row" style={{gap:10, alignItems:'center'}}>
            <div style={{width:26, height:26, borderRadius:999, display:'grid', placeItems:'center', background: i<=step? 'linear-gradient(90deg, #6C63FF, #2B86C5)' : 'rgba(255,255,255,.06)'}}>{i}</div>
            <div className={i===step? 'gradient-text' : 'muted'}>
              {i===1? 'Select': i===2? 'Details' : i===3? 'Payment' : 'Confirm'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className="section">
      <div className="container" style={{maxWidth:980}}>
        <h2 style={{marginTop:0}}>Book • {event.name}</h2>
        <Stepper />

        {step===1 && (
          <div className="glass card">
            <h3 style={{marginTop:0}}>Step 1 • Select Ticket Type</h3>
            <div className="grid" style={{gridTemplateColumns:'repeat(3, 1fr)'}}>
              {['regular','vip','student'].map(t => (
                <label key={t} className="glass card card-hover" style={{cursor:'pointer', border: type===t? '2px solid var(--primary)' : '1px solid rgba(255,255,255,.08)'}}>
                  <input type="radio" name="ticket" value={t} checked={type===t} onChange={()=>setType(t)} style={{display:'none'}}/>
                  <h4 style={{margin:'6px 0'}}>{t.toUpperCase()}</h4>
                  <div className="muted">Price: {currency(event.price[t])}</div>
                </label>
              ))}
            </div>
            <div className="row" style={{marginTop:16}}>
              <div style={{maxWidth:180}}>
                <label className="label">Quantity</label>
                <input className="input" type="number" min={1} max={10} value={qty} onChange={e=>setQty(Math.max(1, parseInt(e.target.value||'1')))} />
              </div>
              <div style={{marginLeft:'auto', fontWeight:600}}>Total: {currency(amount)}</div>
            </div>
            <div className="row" style={{marginTop:16}}>
              <button className="btn btn-outline" onClick={()=>navigate('/events/'+id)}>Back</button>
              <button className="btn btn-gradient" onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="glass card">
            <h3 style={{marginTop:0}}>Step 2 • Your Details</h3>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={user.name} onChange={e=>setUser({...user, name:e.target.value})}/>
                {!user.name && <div className="muted">Required</div>}
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={user.email} onChange={e=>setUser({...user, email:e.target.value})}/>
                {!user.email && <div className="muted">Required</div>}
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={user.phone||''} onChange={e=>setUser({...user, phone:e.target.value})}/>
              </div>
            </div>
            <div className="row" style={{marginTop:16}}>
              <button className="btn btn-outline" onClick={back}>Back</button>
              <button className="btn btn-gradient" onClick={next} disabled={!user.name || !user.email}>Continue</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="glass card">
            <h3 style={{marginTop:0}}>Step 3 • Payment</h3>
            <div className="row" style={{gap:12}}>
              <button className={`btn ${paymentMethod==='upi'?'btn-gradient':'btn-outline'}`} onClick={()=>setPaymentMethod('upi')}>UPI</button>
              <button className={`btn ${paymentMethod==='card'?'btn-gradient':'btn-outline'}`} onClick={()=>setPaymentMethod('card')}>Card</button>
            </div>
            {paymentMethod==='upi' && (
              <div style={{marginTop:12}}>
                <label className="label">UPI ID</label>
                <input className="input" placeholder="yourname@bank" value={upiId} onChange={e=>setUpiId(e.target.value)} />
              </div>
            )}
            {paymentMethod==='card' && (
              <div className="grid" style={{gridTemplateColumns:'2fr 1fr'}}>
                <div>
                  <label className="label">Card Number</label>
                  <input className="input" placeholder="1234 5678 9012 3456" value={card.number} onChange={e=>setCard({...card, number:e.target.value})}/>
                </div>
                <div>
                  <label className="label">Cardholder Name</label>
                  <input className="input" value={card.name} onChange={e=>setCard({...card, name:e.target.value})}/>
                </div>
                <div>
                  <label className="label">Expiry</label>
                  <input className="input" placeholder="MM/YY" value={card.expiry} onChange={e=>setCard({...card, expiry:e.target.value})}/>
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input className="input" placeholder="***" value={card.cvv} onChange={e=>setCard({...card, cvv:e.target.value})}/>
                </div>
              </div>
            )}
            <div className="row" style={{marginTop:16, justifyContent:'space-between'}}>
              <div style={{fontWeight:600}}>Payable: {currency(amount)}</div>
              <div className="row">
                <button className="btn btn-outline" onClick={back}>Back</button>
                <button className="btn btn-gradient" onClick={pay} disabled={processing || (paymentMethod==='upi' && !upiId) || (paymentMethod==='card' && (!card.number || !card.name || !card.expiry || !card.cvv))}>
                  {processing? 'Processing...' : 'Proceed to Pay Securely'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step===4 && (
          <div className="glass card center" style={{textAlign:'center', minHeight:260}}>
            <div className="fadeIn">
              <h3 style={{marginTop:0}}>Payment Successful</h3>
              <div className="muted" style={{marginBottom:12}}>Booking ID: {bookingId}</div>
              <div>{event.name} • {event.venue} • {event.date}</div>
              <div style={{marginTop:6}}>Seat: <b>{type.toUpperCase()}</b> • Qty: <b>{qty}</b> • Paid: <b>{currency(amount)}</b></div>
              <div className="row" style={{justifyContent:'center', marginTop:16}}>
                <button className="btn btn-gradient" onClick={download}>Download Receipt</button>
                <button className="btn btn-outline" onClick={()=>navigate('/dashboard')}>Go to My Tickets</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
