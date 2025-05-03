import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function NotFound() {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mt-4">Page Not Found</h2>
        <p className="text-neutral-600 mt-2 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="btn-primary"
          >
            {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound