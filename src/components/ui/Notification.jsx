import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaInfo, FaExclamationTriangle, FaTimes } from 'react-icons/fa'

function Notification({ message, type = 'info', onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow animation to complete
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="h-5 w-5 text-accent-500" />
      case 'error':
        return <FaExclamationTriangle className="h-5 w-5 text-warning-500" />
      case 'warning':
        return <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <FaInfo className="h-5 w-5 text-primary-500" />
    }
  }
  
  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-accent-50 border-accent-200'
      case 'error': return 'bg-warning-50 border-warning-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      default: return 'bg-primary-50 border-primary-200'
    }
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`flex items-start space-x-4 p-4 rounded-lg shadow-md border ${getBgColor()}`}>
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-medium text-neutral-800">{message}</p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 ml-4 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Notification