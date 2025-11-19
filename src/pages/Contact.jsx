export default function Contact(){
  return (
    <section className="section">
      <div className="container">
        <h2 style={{marginTop:0}}>Contact</h2>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <form className="glass card">
            <label className="label">Name</label>
            <input className="input"/>
            <label className="label" style={{marginTop:10}}>Email</label>
            <input className="input" type="email"/>
            <label className="label" style={{marginTop:10}}>Message</label>
            <textarea className="input" rows={5}></textarea>
            <button className="btn btn-gradient" style={{marginTop:12}}>Send</button>
          </form>
          <div className="glass card center" style={{minHeight:320}}>
            <iframe title="map" width="100%" height="280" style={{border:0, borderRadius:12}} loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-ExampleKey&q=San+Francisco,CA"></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
