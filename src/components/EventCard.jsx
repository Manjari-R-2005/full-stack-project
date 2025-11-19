import { Link } from 'react-router-dom'
import { currency } from '../utils/format'

export default function EventCard({event}){
  return (
    <div className="glass card card-hover" style={{overflow:'hidden'}}>
      <div style={{position:'relative', borderRadius:12, overflow:'hidden'}}>
        <img src={event.image} alt={event.name} style={{width:'100%', height:180, objectFit:'cover', filter:'saturate(1.2)'}}/>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(10,10,10,.9), transparent 60%)'}}/>
        <div style={{position:'absolute', left:12, bottom:12}} className="badge">
          {event.date} • {event.venue}
        </div>
      </div>
      <div style={{paddingTop:12}}>
        <h3 style={{margin:'6px 0 8px'}}>{event.name}</h3>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div className="muted">From {currency(event.price.regular)}</div>
          <Link to={`/events/${event.id}`} className="btn btn-outline">View Details</Link>
        </div>
      </div>
    </div>
  )
}
