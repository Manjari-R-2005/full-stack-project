import { useApp } from '../context/AppContext'

export default function Settings(){
  const { user, setUser } = useApp()
  const toggleLang = ()=> setUser(u => ({...(u||{name:'Guest'}), lang: u?.lang==='hi'?'en':'hi'}))
  return (
    <section className="section">
      <div className="container" style={{maxWidth:720}}>
        <h2 style={{marginTop:0}}>Settings</h2>
        <div className="glass card">
          <div className="row" style={{justifyContent:'space-between'}}>
            <div>
              <div className="muted">Language</div>
              <div>{user?.lang==='hi'?'Hindi':'English'}</div>
            </div>
            <button className="btn btn-outline" onClick={toggleLang}>Toggle</button>
          </div>
        </div>
      </div>
    </section>
  )
}
