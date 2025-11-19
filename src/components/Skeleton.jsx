export default function Skeleton({height=120, radius=12}){
  return (
    <div className="glass" style={{height, borderRadius:radius, width:'100%', background:'linear-gradient(90deg, rgba(255,255,255,.06), rgba(255,255,255,.02), rgba(255,255,255,.06))', backgroundSize:'200% 100%', animation:'pulse 1.4s ease-in-out infinite'}}/>
  )
}
