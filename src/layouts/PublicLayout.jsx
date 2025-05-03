import { Outlet } from 'react-router-dom'
import PublicHeader from '../components/navigation/PublicHeader'
import PublicFooter from '../components/navigation/PublicFooter'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout