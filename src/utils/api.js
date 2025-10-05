const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export function getToken(){
  try{ return JSON.parse(localStorage.getItem('auth'))?.token || null }catch{ return null }
}

export function setAuth(auth){
  localStorage.setItem('auth', JSON.stringify(auth||{}))
}

async function request(path, { method='GET', body, headers }={}){
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': body instanceof FormData ? undefined : 'application/json',
      ...(token? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : (body? JSON.stringify(body) : undefined),
  })
  if(!res.ok){
    const text = await res.text().catch(()=> '')
    throw new Error(text || res.statusText)
  }
  const ct = res.headers.get('content-type')||''
  return ct.includes('application/json')? res.json() : res.text()
}

export const api = {
  login: (email, password)=> request('/auth/login', { method:'POST', body:{ email, password } }),
  // events
  listEvents: ()=> request('/events'),
  getEvent: (id)=> request(`/events/${id}`),
  createEvent: (formData)=> request('/events', { method:'POST', body: formData }),
  updateEvent: (id, formData)=> request(`/events/${id}`, { method:'PUT', body: formData }),
  deleteEvent: (id)=> request(`/events/${id}`, { method:'DELETE' }),
  // users, bookings can be added similarly
}
