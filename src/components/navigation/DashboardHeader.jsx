import { useAuth } from '../../contexts/AuthContext'
import { FaBars, FaBell, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

function DashboardHeader({ toggleSidebar, user, showNotification }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Set up demo notifications
  const notifications = [
    {
      id: 1,
      message: 'New loan application submitted',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      message: 'Documents uploaded by Jane Client',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      message: 'Payment confirmed for Loan #102',
      time: 'Yesterday',
      read: true
    }
  ]
  
  const handleLogout = () => {
    logout()
    showNotification('You have been logged out successfully', 'success')
    navigate('/')
  }
  
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'agent': return 'bg-primary-100 text-primary-800'
      case 'client': return 'bg-accent-100 text-accent-800'
      case 'credit_investigator': return 'bg-yellow-100 text-yellow-800'
      case 'finance_officer': return 'bg-purple-100 text-purple-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }
  
  const formatRoleLabel = (role) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
          >
            <FaBars className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <FaBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-warning-500 ring-2 ring-white"></span>
            </button>
            
            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-neutral-100">
                <div className="py-2 px-4 flex justify-between items-center">
                  <h3 className="text-sm font-medium">Notifications</h3>
                  <button className="text-xs text-primary-600 hover:text-primary-800">
                    Mark all as read
                  </button>
                </div>
                <div className="py-2 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-4 text-neutral-600">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-neutral-50 cursor-pointer ${notification.read ? '' : 'bg-primary-50'}`}
                      >
                        <p className="text-sm font-medium text-neutral-800">{notification.message}</p>
                        <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="py-2 px-4">
                  <button className="text-xs text-primary-600 hover:text-primary-800 w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center text-sm focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              {user?.avatar ? (
                <img 
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
                  <FaUser className="h-4 w-4" />
                </div>
              )}
              <div className="hidden md:block ml-3 text-left">
                <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
            </button>
            
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-2 px-4 border-b border-neutral-100">
                  <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                  <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${getRoleBadgeColor(user?.role)}`}>
                    {formatRoleLabel(user?.role)}
                  </div>
                </div>
                <div className="py-1">
                  <button
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/profile')
                    }}
                  >
                    Your Profile
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/dashboard')
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-warning-600 hover:bg-neutral-100 w-full text-left"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader