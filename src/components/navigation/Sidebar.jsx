import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaHouse as FaHome } from 'react-icons/fa6'
import { FaFile as FaFileAlt } from 'react-icons/fa6'
import { FaArrowUpFromBracket as FaUpload } from 'react-icons/fa6'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { FaCreditCard } from 'react-icons/fa6'
import { FaChartLine } from 'react-icons/fa6'
import { FaUser as FaUserAlt } from 'react-icons/fa6'
import { FaXmark as FaTimes } from 'react-icons/fa6'

function Sidebar({ isOpen, setIsOpen, role }) {
  const sidebarRef = useRef(null)
  const location = useLocation()
  
  // Close sidebar on path change (for mobile)
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, setIsOpen])
  
  // Close sidebar when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])
  
  // Navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
      { to: '/profile', icon: <FaUserAlt />, label: 'My Profile' }
    ]
    
    const roleLinks = {
      agent: [
        { to: '/loan-applications', icon: <FaFileAlt />, label: 'Loan Applications' }
      ],
      client: [
        { to: '/client/loans', icon: <FaFileAlt />, label: 'My Loans' },
        { to: '/client/documents', icon: <FaUpload />, label: 'Documents' }
      ],
      credit_investigator: [
        { to: '/credit-investigation', icon: <FaMagnifyingGlass />, label: 'Investigations' }
      ],
      finance_officer: [
        { to: '/loans', icon: <FaFileAlt />, label: 'Active Loans' },
        { to: '/disbursements', icon: <FaCreditCard />, label: 'Disbursements' },
        { to: '/reports', icon: <FaChartLine />, label: 'Reports' }
      ]
    }
    
    return [...commonLinks, ...(roleLinks[role] || [])]
  }
  
  const linkClass = 'flex items-center gap-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg transition-colors'
  const activeLinkClass = 'text-primary-600 bg-primary-50 font-medium'
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-800 bg-opacity-50 z-20 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:relative inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-primary-600">LoanPro</h2>
          <button 
            className="md:hidden text-neutral-500 hover:text-neutral-700"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-4 px-2 space-y-1">
          {getNavLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `${linkClass} ${isActive ? activeLinkClass : ''}`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200">
          <div className="text-xs text-neutral-500 text-center">
            <p>LoanPro Version 1.0</p>
            <p>&copy; 2025 LoanPro Systems</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar