const items = Array.from({length:12}).map((_,i)=> ({ id:i, img:`https://picsum.photos/seed/concert${i}/600/400` }))

export default function Gallery(){
  return (
    <section className="section">
      <div className="container">
        <h2 style={{marginTop:0}}>Gallery</h2>
        <div className="grid grid-3">
          {items.map(x=> (
            <div key={x.id} className="glass card card-hover" style={{overflow:'hidden'}}>
              <img src={x.img} alt="Concert" style={{width:'100%', height:240, objectFit:'cover'}}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
