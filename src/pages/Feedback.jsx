export default function Feedback(){
  return (
    <section className="section">
      <div className="container" style={{maxWidth:800}}>
        <h2 style={{marginTop:0}}>Feedback & Reviews</h2>
        <form className="glass card">
          <label className="label">Your Experience</label>
          <textarea className="input" rows={5} placeholder="Tell us about your concert experience..."></textarea>
          <div className="row" style={{marginTop:10}}>
            <button className="btn btn-gradient">Submit</button>
            <button type="reset" className="btn btn-outline">Clear</button>
          </div>
        </form>
      </div>
    </section>
  )
}
