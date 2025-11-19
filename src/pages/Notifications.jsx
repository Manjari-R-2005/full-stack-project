const items = [
  { id:1, text:'New event added: Neon Nights Festival Encore' },
  { id:2, text:'Your ticket for Rock Legends Live is confirmed' },
]

export default function Notifications(){
  return (
    <section className="section">
      <div className="container">
        <h2 style={{marginTop:0}}>Notifications</h2>
        <div className="grid">
          {items.map(i=> (
            <div key={i.id} className="glass card">{i.text}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
