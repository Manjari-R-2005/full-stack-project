import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export const ADMIN_EMAIL = 'manjari.raveendran@gmail.com'

export function PrivateRoute({ children }){
  const { user } = useApp()
  if(!user) return <Navigate to="/login" replace />
  return children
}

export function AdminRoute({ children }){
  const { user } = useApp()
  if(!user) return <Navigate to="/login" replace />
  if(user.email !== ADMIN_EMAIL) return <Navigate to="/dashboard" replace />
  return children
}
