import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DashboardHeader from '../components/navigation/DashboardHeader'
import Sidebar from '../components/navigation/Sidebar'
import Notification from '../components/ui/Notification'

function DashboardLayout() {
  const [notification, setNotification] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardHeader 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        user={user}
        showNotification={showNotification}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          role={user?.role} 
        />
        
        <main className="flex-1 p-6">
          <Outlet context={{ showNotification }} />
        </main>
      </div>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}

export default DashboardLayout