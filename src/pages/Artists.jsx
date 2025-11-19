import { useApp } from '../context/AppContext'

export default function Artists(){
  const { artists } = useApp()
  return (
    <section className="section">
      <div className="container">
        <h2 style={{marginTop:0}}>Artists</h2>
        <div className="grid grid-3">
          {artists.map(a => (
            <div key={a.id} className="glass card card-hover center" style={{textAlign:'center'}}>
              <img src={a.image} alt={a.name} style={{width:140, height:140, borderRadius:'50%', objectFit:'cover', filter:'saturate(1.1)'}}/>
              <h3 style={{margin:'10px 0 4px'}}>{a.name}</h3>
              <div className="muted">{a.genre}</div>
              <p style={{marginTop:10}} className="muted">{a.bio}</p>
              <div className="row" style={{marginTop:8}}>
                <a className="btn btn-outline" href="#">Twitter</a>
                <a className="btn btn-outline" href="#">Instagram</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
