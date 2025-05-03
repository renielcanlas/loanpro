import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Home from './pages/public/Home'

// Private Pages
import Dashboard from './pages/dashboard/Dashboard'
import LoanApplications from './pages/dashboard/LoanApplications'
import LoanDetails from './pages/dashboard/LoanDetails'
import ClientDocuments from './pages/dashboard/ClientDocuments'
import CreditInvestigation from './pages/dashboard/CreditInvestigation'
import Payments from './pages/dashboard/Payments'
import Profile from './pages/dashboard/Profile'
import NotFound from './pages/NotFound'

// Guards
import PrivateRoute from './components/guards/PrivateRoute'
import RoleRoute from './components/guards/RoleRoute'

function App() {
  const { isInitialized } = useAuth()

  // Demo data initialization
  useEffect(() => {
    // This would be removed in a production app with a real backend
    if (!localStorage.getItem('loanpro_initialized')) {
      // Initialize some demo data
      localStorage.setItem('loanpro_initialized', 'true')
    }
  }, [])

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4">Loading application...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Common Routes */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Agent Routes */}
          <Route element={<RoleRoute roles={['agent']} />}>
            <Route path="/loan-applications" element={<LoanApplications />} />
            <Route path="/loan-applications/:id" element={<LoanDetails />} />
            <Route path="/loan-applications/:id/payments" element={<Payments />} />
          </Route>
          
          {/* Client Routes */}
          <Route element={<RoleRoute roles={['client']} />}>
            <Route path="/client/documents/:id" element={<ClientDocuments />} />
            <Route path="/client/loans" element={<LoanApplications />} />
            <Route path="/client/loans/:id/payments" element={<Payments />} />
          </Route>
          
          {/* Credit Investigator Routes */}
          <Route element={<RoleRoute roles={['credit_investigator']} />}>
            <Route path="/credit-investigation" element={<CreditInvestigation />} />
            <Route path="/credit-investigation/:id" element={<LoanDetails />} />
          </Route>
          
          {/* Finance Officer Routes */}
          <Route element={<RoleRoute roles={['finance_officer']} />}>
            <Route path="/loans" element={<LoanApplications />} />
            <Route path="/loans/:id" element={<LoanDetails />} />
            <Route path="/disbursements" element={<Payments />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="/404" element={<NotFound />} />
      
      {/* Redirect all other routes to 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App