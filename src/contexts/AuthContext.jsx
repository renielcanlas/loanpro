import { createContext, useContext, useState, useEffect } from 'react'
import { initialUsers } from '../data/demoData'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize demo users if they don't exist
  useEffect(() => {
    const storedUsers = localStorage.getItem('users')
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(initialUsers))
    }
    
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    
    setLoading(false)
    setIsInitialized(true)
  }, [])

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      // Remove password from stored user object
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }
    
    return { success: false, message: 'Invalid email or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'Email already in use' }
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Login the user after registration
    const { password, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
    
    return { success: true, user: userWithoutPassword }
  }

  const createClientAccount = (clientData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Create a simple password for demo purposes
    const password = 'client123'
    
    const newUser = {
      id: `user_${Date.now()}`,
      ...clientData,
      email: clientData.email,
      password,
      role: 'client',
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    return { success: true, user: newUser }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isInitialized,
    loading,
    login,
    logout,
    register,
    createClientAccount,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}