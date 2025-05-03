import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function RoleRoute({ roles }) {
  const { user } = useAuth()
  const context = useOutletContext()

  // If user's role is not in the allowed roles, redirect to dashboard
  if (!roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet context={context} />
}

export default RoleRoute