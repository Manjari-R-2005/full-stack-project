import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="footer">
      <div className="container center" style={{textAlign:'center', gap:10}}>
        <div className="row" style={{justifyContent:'center'}}>
          <Link to="/terms" className="link">Terms</Link>
          <Link to="/privacy" className="link">Privacy</Link>
          <Link to="/faq" className="link">FAQ</Link>
          <Link to="/feedback" className="link">Feedback</Link>
        </div>
        <div className="muted">© 2025 ConcertHub</div>
      </div>
    </footer>
  )
}
