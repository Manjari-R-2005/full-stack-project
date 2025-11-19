import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { currency } from '../utils/format'

export default function EventDetails(){
  const { id } = useParams()
  const { events, seats } = useApp()
  const event = events.find(e => e.id === id)

  if(!event){
    return <section className="section"><div className="container">Event not found.</div></section>
  }

  const available = seats[id] || { regular:0, vip:0, student:0 }

  return (
    <section className="section">
      <div className="container">
        <div className="grid" style={{gridTemplateColumns:'1.2fr .8fr'}}>
          <div className="glass card">
            <img src={event.image} alt={event.name} style={{width:'100%', borderRadius:12, marginBottom:12}}/>
            <h1 className="gradient-text" style={{marginBottom:6}}>{event.name}</h1>
            <div className="muted" style={{marginBottom:12}}>{event.date} • {event.venue} • {event.category}</div>
            <p style={{lineHeight:1.8}}>{event.description}</p>
          </div>
          <aside className="glass card">
            <h3 style={{marginTop:0}}>Tickets</h3>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>Regular</div>
              <div>{currency(event.price.regular)} • <span className="muted">{available.regular} left</span></div>
            </div>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>VIP</div>
              <div>{currency(event.price.vip)} • <span className="muted">{available.vip} left</span></div>
            </div>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>Student</div>
              <div>{currency(event.price.student)} • <span className="muted">{available.student} left</span></div>
            </div>
            <Link to={`/book/${event.id}`} className="btn btn-gradient" style={{marginTop:12}}>Book Tickets</Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
