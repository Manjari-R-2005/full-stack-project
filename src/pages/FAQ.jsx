const faqs = [
  {q:'How do I get a refund?', a:'Contact support within 24 hours before the event. Policies may vary per organizer.'},
  {q:'Are tickets transferable?', a:'Yes, you can transfer ownership from the dashboard for eligible events.'},
  {q:'Do you support student discounts?', a:'Yes, select Student ticket type during booking if available.'}
]

export default function FAQ(){
  return (
    <section className="section">
      <div className="container">
        <h2 style={{marginTop:0}}>FAQ</h2>
        <div className="grid">
          {faqs.map((f,i)=> (
            <div key={i} className="glass card">
              <h3 style={{marginTop:0}}>{f.q}</h3>
              <p className="muted">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
