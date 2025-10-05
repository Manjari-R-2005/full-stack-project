import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { setAuth } from '../utils/api'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, setUser } = useApp()

  useEffect(()=>{
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  },[])

  const navItems = [
    {to:'/', label:'Home'},
    {to:'/events', label:'Events'},
    {to:'/artists', label:'Artists'},
    {to:'/gallery', label:'Gallery'},
    {to:'/about', label:'About'},
    {to:'/contact', label:'Contact'},
  ]

  return (
    <header className={`nav-fixed ${scrolled ? 'shrink' : ''}`}>
      <div className="container" style={{padding:'14px 0'}}>
        <div className="space-between">
          <Link to="/" className="logo gradient-text" style={{fontSize:24}}>ConcertHub</Link>

          <nav className="row" style={{display: open? 'grid' : '', gridTemplateColumns: '1fr', position:'relative'}}>
            <button className="btn btn-outline" onClick={()=>setOpen(v=>!v)} aria-label="Toggle Menu" style={{display:'none'}} id="hamburger">☰</button>
            <div className="row" id="nav-links" style={{gap:18}}>
              {navItems.map(n => (
                <NavLink key={n.to} to={n.to} className={({isActive})=>`muted ${isActive? 'gradient-text' : ''}`} style={{textDecoration:'none'}}>
                  {n.label}
                </NavLink>
              ))}
              <NavLink to="/events" className="btn btn-outline">Discover Events</NavLink>
              {!user && (
                <>
                  <NavLink to="/login" className="btn btn-outline">Login</NavLink>
                  <NavLink to="/signup" className="btn btn-gradient pulse">Signup</NavLink>
                </>
              )}
              {user && (
                <div
                  className="glass card"
                  style={{padding:'8px 12px', borderRadius:12, position:'relative'}}
                  onMouseEnter={()=>setShowUserMenu(true)}
                  onMouseLeave={()=>setShowUserMenu(false)}
                >
                  <div className="row" style={{gap:10, alignItems:'center'}}>
                    <div className="badge" style={{background:'rgba(255,255,255,.06)'}}>
                      {user.name || 'User'}
                    </div>
                  </div>
                  {showUserMenu && (
                    <div className="glass card" style={{position:'absolute', right:0, top:'110%', minWidth:220}}>
                      <Link to="/profile" className="btn btn-outline" style={{width:'100%'}}>Profile</Link>
                      <button className="btn btn-outline" style={{width:'100%'}} onClick={()=>{ setAuth(null); setUser(null); }}>Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
