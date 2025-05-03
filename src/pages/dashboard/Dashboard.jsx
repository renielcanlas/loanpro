import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLoan } from '../../contexts/LoanContext'
import { motion } from 'framer-motion'
import StatusBadge from '../../components/ui/StatusBadge'
import { loanStatusConfig } from '../../data/demoData'
import { format } from 'date-fns'
import {
  FaFile as FaFileAlt,
  FaFileInvoice,
  FaUsers,
  FaUserCheck,
  FaCreditCard,
  FaChartLine,
  FaClipboardCheck,
  FaTriangleExclamation as FaExclamationTriangle
} from 'react-icons/fa6'

function Dashboard() {
  const { user } = useAuth()
  const { loans, documents, payments, loading } = useLoan()
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    pendingReview: 0,
    pendingInvestigation: 0,
    totalClients: 0,
    totalPayments: 0,
    recentActivity: []
  })
  
  useEffect(() => {
    if (!loading) {
      // Calculate stats based on role
      const activeLoans = loans.filter(loan => 
        loan.status !== 'closed' && loan.status !== 'rejected' && loan.status !== 'ci_rejected'
      )
      
      const pendingReviewLoans = loans.filter(loan => loan.status === 'review')
      const pendingInvestigationLoans = loans.filter(loan => loan.status === 'credit_investigation')
      
      // Get unique clients
      const uniqueClientIds = [...new Set(loans.map(loan => loan.clientId))]
      
      // Recent activity (combine status changes, document uploads, and payments)
      const recentActivity = [
        ...loans.flatMap(loan => 
          (loan.statusHistory || []).map(history => ({
            type: 'status',
            date: new Date(history.date),
            loanId: loan.id,
            clientName: loan.clientName,
            details: `Loan status changed to ${loanStatusConfig[history.status]?.label || history.status}`
          }))
        ),
        ...documents.map(doc => ({
          type: 'document',
          date: new Date(doc.uploadedAt),
          loanId: doc.loanId,
          clientName: loans.find(l => l.id === doc.loanId)?.clientName || 'Unknown Client',
          details: `Document "${doc.title}" uploaded`
        })),
        ...payments.map(payment => ({
          type: 'payment',
          date: new Date(payment.date),
          loanId: payment.loanId,
          clientName: loans.find(l => l.id === payment.loanId)?.clientName || 'Unknown Client',
          details: `Payment of $${payment.amount.toFixed(2)} recorded`
        }))
      ]
      .sort((a, b) => b.date - a.date)
      .slice(0, 10)
      
      // Filter data based on user role
      let filteredActiveLoans = activeLoans
      let filteredPendingReview = pendingReviewLoans
      let filteredPendingInvestigation = pendingInvestigationLoans
      let filteredActivity = recentActivity
      
      if (user.role === 'client') {
        filteredActiveLoans = activeLoans.filter(loan => loan.clientId === user.id)
        filteredActivity = recentActivity.filter(activity => {
          const loan = loans.find(l => l.id === activity.loanId)
          return loan && loan.clientId === user.id
        })
      } else if (user.role === 'credit_investigator') {
        filteredActiveLoans = activeLoans.filter(loan => loan.status === 'credit_investigation')
        filteredActivity = recentActivity.filter(activity => {
          const loan = loans.find(l => l.id === activity.loanId)
          return loan && ['review', 'credit_investigation', 'ci_approved', 'ci_rejected'].includes(loan.status)
        })
      }
      
      setStats({
        totalLoans: filteredActiveLoans.length,
        activeLoans: filteredActiveLoans.filter(loan => 
          ['processing', 'released'].includes(loan.status)
        ).length,
        pendingReview: filteredPendingReview.length,
        pendingInvestigation: filteredPendingInvestigation.length,
        totalClients: uniqueClientIds.length,
        totalPayments: payments.length,
        recentActivity: filteredActivity
      })
    }
  }, [loading, loans, documents, payments, user])
  
  // Dashboard widgets based on role
  const getDashboardWidgets = () => {
    const commonWidgets = [
      {
        title: 'Active Loans',
        value: stats.activeLoans,
        icon: <FaFileInvoice className="h-6 w-6 text-primary-500" />,
        color: 'bg-primary-50',
        link: user.role === 'client' ? '/client/loans' : '/loan-applications'
      }
    ]
    
    const roleWidgets = {
      agent: [
        {
          title: 'Pending Review',
          value: stats.pendingReview,
          icon: <FaClipboardCheck className="h-6 w-6 text-yellow-500" />,
          color: 'bg-yellow-50',
          link: '/loan-applications'
        },
        {
          title: 'Total Clients',
          value: stats.totalClients,
          icon: <FaUsers className="h-6 w-6 text-purple-500" />,
          color: 'bg-purple-50',
          link: '#'
        },
        {
          title: 'Total Payments',
          value: stats.totalPayments,
          icon: <FaCreditCard className="h-6 w-6 text-green-500" />,
          color: 'bg-green-50',
          link: '/payments'
        }
      ],
      client: [
        {
          title: 'Documents',
          value: documents.filter(doc => {
            const loan = loans.find(l => l.id === doc.loanId)
            return loan && loan.clientId === user.id
          }).length,
          icon: <FaFileAlt className="h-6 w-6 text-blue-500" />,
          color: 'bg-blue-50',
          link: '/client/documents'
        },
        {
          title: 'Payments Made',
          value: payments.filter(payment => {
            const loan = loans.find(l => l.id === payment.loanId)
            return loan && loan.clientId === user.id
          }).length,
          icon: <FaCreditCard className="h-6 w-6 text-green-500" />,
          color: 'bg-green-50',
          link: '#'
        }
      ],
      credit_investigator: [
        {
          title: 'Pending Investigations',
          value: stats.pendingInvestigation,
          icon: <FaUserCheck className="h-6 w-6 text-yellow-500" />,
          color: 'bg-yellow-50',
          link: '/credit-investigation'
        },
        {
          title: 'Completed Investigations',
          value: loans.filter(loan => 
            ['ci_approved', 'ci_rejected'].includes(loan.status)
          ).length,
          icon: <FaClipboardCheck className="h-6 w-6 text-green-500" />,
          color: 'bg-green-50',
          link: '#'
        }
      ],
      finance_officer: [
        {
          title: 'Loans to Release',
          value: loans.filter(loan => loan.status === 'processing').length,
          icon: <FaCreditCard className="h-6 w-6 text-purple-500" />,
          color: 'bg-purple-50',
          link: '/disbursements'
        },
        {
          title: 'Released Loans',
          value: loans.filter(loan => loan.status === 'released').length,
          icon: <FaChartLine className="h-6 w-6 text-green-500" />,
          color: 'bg-green-50',
          link: '/loans'
        },
        {
          title: 'Pending Payments',
          value: loans.filter(loan => 
            loan.status === 'released' && 
            payments.filter(p => p.loanId === loan.id).length === 0
          ).length,
          icon: <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />,
          color: 'bg-yellow-50',
          link: '#'
        }
      ]
    }
    
    return [...commonWidgets, ...(roleWidgets[user.role] || [])]
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md text-white p-6">
        <h1 className="text-2xl font-semibold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-primary-100">
          {
            user.role === 'agent' ? 'Manage your loan applications and client accounts' :
            user.role === 'client' ? 'Track your loan applications and upload documents' :
            user.role === 'credit_investigator' ? 'Review pending loan applications and submit reports' :
            'Process loan disbursements and track payments'
          }
        </p>
        <div className="mt-4">
          {user.role === 'agent' && (
            <Link to="/loan-applications" className="btn bg-white text-primary-700 hover:bg-primary-50">
              View Loan Applications
            </Link>
          )}
          {user.role === 'client' && (
            <Link to="/client/loans" className="btn bg-white text-primary-700 hover:bg-primary-50">
              View My Loans
            </Link>
          )}
          {user.role === 'credit_investigator' && (
            <Link to="/credit-investigation" className="btn bg-white text-primary-700 hover:bg-primary-50">
              Pending Investigations
            </Link>
          )}
          {user.role === 'finance_officer' && (
            <Link to="/disbursements" className="btn bg-white text-primary-700 hover:bg-primary-50">
              Process Disbursements
            </Link>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getDashboardWidgets().map((widget, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link 
              to={widget.link} 
              className="block h-full"
            >
              <div className={`rounded-lg shadow-sm border border-neutral-200 overflow-hidden h-full ${widget.color} hover:shadow-md transition-shadow`}>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full mr-4 bg-white">
                      {widget.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-500">
                        {widget.title}
                      </p>
                      <p className="text-2xl font-semibold text-neutral-800">
                        {widget.value}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user.role === 'agent' && (
            <>
              <Link to="/loan-applications" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaFileAlt className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">View Applications</span>
              </Link>
              <Link to="/loan-applications/new" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaFileInvoice className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">New Application</span>
              </Link>
              <Link to="/payments" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaCreditCard className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Record Payment</span>
              </Link>
              <Link to="#" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaChartLine className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">View Reports</span>
              </Link>
            </>
          )}
          
          {user.role === 'client' && (
            <>
              <Link to="/client/loans" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaFileAlt className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">My Loans</span>
              </Link>
              <Link to="/client/documents" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaFileInvoice className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Upload Documents</span>
              </Link>
              <Link to="#" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaCreditCard className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Payment Schedule</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaUsers className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">My Profile</span>
              </Link>
            </>
          )}
          
          {user.role === 'credit_investigator' && (
            <>
              <Link to="/credit-investigation" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaUserCheck className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Pending Investigations</span>
              </Link>
              <Link to="#" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaClipboardCheck className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Completed Reviews</span>
              </Link>
              <Link to="#" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaFileAlt className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Investigation Forms</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaUsers className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">My Profile</span>
              </Link>
            </>
          )}
          
          {user.role === 'finance_officer' && (
            <>
              <Link to="/loans" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaFileAlt className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Active Loans</span>
              </Link>
              <Link to="/disbursements" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaCreditCard className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Disbursements</span>
              </Link>
              <Link to="#" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaChartLine className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">Financial Reports</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <FaUsers className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-sm text-neutral-800 text-center">My Profile</span>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-medium">Recent Activity</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {stats.recentActivity.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">
              No recent activity found
            </div>
          ) : (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4 hover:bg-neutral-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === 'status' && (
                      <div className="rounded-full p-2 bg-blue-100 text-blue-600">
                        <FaFileAlt className="h-4 w-4" />
                      </div>
                    )}
                    {activity.type === 'document' && (
                      <div className="rounded-full p-2 bg-green-100 text-green-600">
                        <FaFileInvoice className="h-4 w-4" />
                      </div>
                    )}
                    {activity.type === 'payment' && (
                      <div className="rounded-full p-2 bg-purple-100 text-purple-600">
                        <FaCreditCard className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-neutral-900">
                      {activity.clientName}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {activity.details}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {format(activity.date, 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link 
                      to={
                        user.role === 'client' 
                          ? `/client/loans` 
                          : `/loan-applications/${activity.loanId}`
                      } 
                      className="text-xs text-primary-600 hover:text-primary-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {stats.recentActivity.length > 0 && (
          <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200">
            <Link 
              to="#" 
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              View all activity
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard