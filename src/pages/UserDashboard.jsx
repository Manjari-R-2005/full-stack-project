import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import { useApp } from '../context/AppContext'
import { currency, shortDate } from '../utils/format'
import { generateReceipt } from '../utils/receipt'

export default function UserDashboard(){
  const { bookings, events, cancelBooking, user } = useApp()
  const { search } = useLocation()
  const success = new URLSearchParams(search).get('success')

  const list = useMemo(()=> bookings.map(b => ({
    ...b,
    event: events.find(e=>e.id===b.eventId)
  })), [bookings, events])

  return (
    <section className="section">
      <div className="container">
        <div className="space-between" style={{marginBottom:16}}>
          <h2 style={{marginTop:0}}>My Tickets</h2>
          <div className="muted">{user? `Welcome, ${user.name}` : 'Guest Mode'}</div>
        </div>

        {success && (
          <div className="glass card" style={{borderLeft:'4px solid var(--primary)'}}>Booking confirmed • ID {success}</div>
        )}

        <div className="grid grid-3">
          {list.map(b => (
            <div key={b.id} className="glass card">
              <div className="row" style={{justifyContent:'space-between'}}>
                <div>
                  <div className="badge">{b.status.toUpperCase()}</div>
                  <h3 style={{margin:'8px 0 6px'}}>{b.event?.name}</h3>
                  <div className="muted">{shortDate(b.event?.date)} • {b.event?.venue}</div>
                  <div style={{marginTop:8}}>Type: <b style={{textTransform:'uppercase'}}>{b.type}</b> • Qty: <b>{b.qty}</b></div>
                  <div className="muted" style={{marginTop:6}}>Booked on {new Date(b.createdAt).toLocaleString()}</div>
                </div>
                <QRCodeCanvas value={b.id} size={96} bgColor="#0A0A0A" fgColor="#EAEAEA"/>
              </div>
              <div className="row" style={{marginTop:12}}>
                <button
                  className="btn btn-outline"
                  onClick={()=> generateReceipt({
                    bookingId: b.id,
                    event: b.event,
                    user: b.user || user || { name:'', email:'' },
                    type: b.type,
                    qty: b.qty,
                    amount: b.amount ?? (b.event?.price?.[b.type] ? (b.event.price[b.type] * b.qty) : 0)
                  })}
                >
                  Download Receipt
                </button>
                {b.status!=='confirmed' && (
                  <button className="btn btn-outline" onClick={()=>cancelBooking(b.id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {list.length===0 && (
          <div className="glass card center" style={{minHeight:180, textAlign:'center'}}>
            <div>
              <h3>No bookings yet</h3>
              <div className="muted">Find your vibe in the Events page and book your first ticket.</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
