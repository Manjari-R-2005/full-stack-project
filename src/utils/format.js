export const currency = (n)=> new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n)
export const shortDate = (d)=> new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric'})
export const uid = ()=> Math.random().toString(36).slice(2,9)
