import { useState } from 'react'
import EventCard from '../components/EventCard'
import { useApp } from '../context/AppContext'

const CATEGORIES = ['All','Rock','Jazz','Pop','EDM','Hip-Hop','Indie']

export default function Events(){
  const { events } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  const list = events.filter(e => (cat==='All' || e.category===cat) && e.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <section className="section">
      <div className="container">
        <div className="glass card" style={{marginBottom:18}}>
          <div className="row" style={{gap:12}}>
            <input className="input" placeholder="Search events, artists, venues" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="input" value={cat} onChange={e=>setCat(e.target.value)}>
              {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-3">
          {list.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </div>
    </section>
  )
}
