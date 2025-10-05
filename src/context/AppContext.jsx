import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { events as seedEvents, artists as seedArtists } from '../data/mock'
import { uid } from '../utils/format'

const AppContext = createContext(null)

const load = (k, v)=>{
  try{ const x = JSON.parse(localStorage.getItem(k)); return x ?? v }catch{ return v }
}
const save = (k, v)=> localStorage.setItem(k, JSON.stringify(v))

export function AppProvider({children}){
  const [events, setEvents] = useState(()=> load('events', seedEvents))
  const [artists, setArtists] = useState(()=> load('artists', seedArtists))
  const [seats, setSeats] = useState(()=> load('seats', Object.fromEntries(seedEvents.map(e=>[e.id,{regular:120, vip:40, student:80}]))))
  const [bookings, setBookings] = useState(()=> load('bookings', []))
  const [user, setUser] = useState(()=> load('user', null))

  useEffect(()=> save('events', events), [events])
  useEffect(()=> save('artists', artists), [artists])
  useEffect(()=> save('seats', seats), [seats])
  useEffect(()=> save('bookings', bookings), [bookings])
  useEffect(()=> save('user', user), [user])

  const bookTickets = (eventId, type, qty, userInfo, meta={})=>{
    setSeats(s => ({...s, [eventId]:{...s[eventId], [type]: Math.max(0, (s[eventId]?.[type] ?? 0) - qty)}}))
    const id = 'BK-'+uid().toUpperCase()
    const rec = { id, eventId, type, qty, user:userInfo, createdAt: Date.now(), status:'confirmed', ...meta }
    setBookings(b => [rec, ...b])
    return id
  }

  const cancelBooking = (id)=>{
    setBookings(bs => bs.map(b => b.id===id? {...b, status:'cancelled'}:b))
  }

  const addEvent = (payload)=> setEvents(es => [{...payload, id: uid()}, ...es])
  const updateEvent = (id, patch)=> setEvents(es => es.map(e => e.id===id? {...e, ...patch} : e))
  const deleteEvent = (id)=> setEvents(es => es.filter(e => e.id!==id))

  const value = useMemo(()=>({ events, artists, seats, bookings, user, setUser, bookTickets, cancelBooking, addEvent, updateEvent, deleteEvent }), [events, artists, seats, bookings, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = ()=> useContext(AppContext)
