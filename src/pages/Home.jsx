import { Link } from 'react-router-dom'
import EventCard from '../components/EventCard'
import GlowButton from '../components/GlowButton'
import { useApp } from '../context/AppContext'

export default function Home(){
  const { events } = useApp()

  return (
    <div>
      <section className="hero">
        <video autoPlay loop muted playsInline src="https://cdn.coverr.co/videos/coverr-crowd-screaming-2870/1080p.mp4"></video>
        <div className="overlay"/>
        <div className="content fadeInUp">
          <h1 className="gradient-text" style={{fontSize:48, marginBottom:12}}>Experience the Rhythm of Life at ConcertHub</h1>
          <div className="row" style={{justifyContent:'center'}}>
            <GlowButton as={Link} to="/events">Discover Events</GlowButton>
            <GlowButton as={Link} to="/events" className="btn-outline">Book Now</GlowButton>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="space-between" style={{marginBottom:16}}>
            <h2>Upcoming Events</h2>
            <Link to="/events" className="link">View all</Link>
          </div>
          <div style={{display:'grid', gridAutoFlow:'column', gridAutoColumns:'minmax(260px, 1fr)', gap:16, overflowX:'auto', paddingBottom:8}}>
            {events.slice(0,8).map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
