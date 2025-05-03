import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLoan } from '../../contexts/LoanContext'
import StatusBadge from '../../components/ui/StatusBadge'
import LoanStatusStepper from '../../components/ui/LoanStatusStepper'
import { format } from 'date-fns'
import { loanStatusConfig } from '../../data/demoData'
import { 
  FaFile as FaFileAlt, 
  FaUpload, 
  FaMoneyBill, 
  FaUserCheck, 
  FaXmark as FaTimes, 
  FaCheck 
} from 'react-icons/fa6'

function LoanDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { loans, documents, updateLoanStatus, getLoanDocuments, createClientAccount } = useLoan()
  const { showNotification } = useOutletContext()
  
  const [loan, setLoan] = useState(null)
  const [loanDocuments, setLoanDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusNotes, setStatusNotes] = useState('')
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  
  useEffect(() => {
    if (loans.length > 0) {
      const foundLoan = loans.find(l => l.id === id)
      if (foundLoan) {
        setLoan(foundLoan)
        setLoanDocuments(getLoanDocuments(id))
      } else {
        navigate('/loan-applications')
      }
      setLoading(false)
    }
  }, [id, loans, getLoanDocuments, navigate])
  
  // Get available status transitions based on current status and user role
  const getAvailableStatusTransitions = () => {
    if (!loan) return []
    
    const transitions = {
      agent: {
        initial_review: ['review', 'rejected'],
        review: ['credit_investigation', 'rejected'],
        ci_approved: ['processing', 'rejected'],
        processing: ['released', 'rejected']
      },
      credit_investigator: {
        credit_investigation: ['ci_approved', 'ci_rejected']
      },
      finance_officer: {
        processing: ['released', 'rejected']
      }
    }
    
    return transitions[user.role]?.[loan.status] || []
  }
  
  // Handle status change
  const handleStatusChange = async (status) => {
    try {
      const updatedLoan = updateLoanStatus(loan.id, status, statusNotes)
      
      setLoan(updatedLoan)
      setIsStatusModalOpen(false)
      setStatusNotes('')
      
      // If status is "review", create client account
      if (status === 'review' && !loan.clientAccountCreated) {
        const clientData = {
          name: loan.clientName,
          email: `client_${loan.id}@example.com` // Demo email
        }
        
        createClientAccount(clientData)
        showNotification(`Client account created for ${loan.clientName}`, 'success')
      }
      
      showNotification(`Loan status updated to ${loanStatusConfig[status]?.label || status}`, 'success')
    } catch (error) {
      showNotification('Failed to update loan status', 'error')
      console.error(error)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4">Loading loan details...</p>
        </div>
      </div>
    )
  }
  
  if (!loan) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">Loan not found</p>
        <button 
          onClick={() => navigate('/loan-applications')}
          className="mt-4 btn-primary"
        >
          Go Back to Loan Applications
        </button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">
            Loan Application Details
          </h1>
          <p className="text-neutral-500 mt-1">
            {loan.id}
          </p>
        </div>
        <StatusBadge status={loan.status} />
      </div>
      
      {/* Status Stepper */}
      <LoanStatusStepper currentStatus={loan.status} statusHistory={loan.statusHistory} />
      
      {/* Loan Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <h2 className="font-medium text-neutral-800">Client Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500">Name</label>
              <p className="mt-1 text-neutral-800">{loan.clientName}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Client ID</label>
              <p className="mt-1 text-neutral-800">{loan.clientId}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Agent</label>
              <p className="mt-1 text-neutral-800">{user.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Application Date</label>
              <p className="mt-1 text-neutral-800">
                {format(new Date(loan.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Loan Information */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <h2 className="font-medium text-neutral-800">Loan Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500">Amount</label>
              <p className="mt-1 text-neutral-800">${loan.amount?.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Term</label>
              <p className="mt-1 text-neutral-800">{loan.term} months</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Interest Rate</label>
              <p className="mt-1 text-neutral-800">{loan.interestRate}%</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Purpose</label>
              <p className="mt-1 text-neutral-800">{loan.purpose}</p>
            </div>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <h2 className="font-medium text-neutral-800">Payment Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500">Monthly Payment</label>
              <p className="mt-1 text-neutral-800">${loan.monthlyPayment?.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Total Payable</label>
              <p className="mt-1 text-neutral-800">${loan.totalPayable?.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">First Payment Due</label>
              <p className="mt-1 text-neutral-800">
                {loan.status === 'released' 
                  ? format(new Date(new Date(loan.updatedAt).setMonth(new Date(loan.updatedAt).getMonth() + 1)), 'MMMM d, yyyy')
                  : 'After release'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500">Status</label>
              <div className="mt-1">
                <StatusBadge status={loan.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="font-medium text-neutral-800">Documents</h2>
          {user.role === 'agent' && loan.status === 'initial_review' && (
            <button 
              className="btn-secondary text-xs"
              onClick={() => {
                setSelectedStatus('review')
                setIsStatusModalOpen(true)
              }}
            >
              <FaUpload className="mr-1 h-3 w-3" />
              Request Documents
            </button>
          )}
        </div>
        
        <div className="divide-y divide-neutral-200">
          {loanDocuments.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">
              {loan.status === 'initial_review' 
                ? 'Documents will be requested after initial review' 
                : loan.status === 'review'
                  ? 'Waiting for client to upload documents'
                  : 'No documents uploaded yet'}
            </div>
          ) : (
            loanDocuments.map((doc, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <FaFileAlt className="h-5 w-5 text-neutral-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{doc.title}</p>
                    <p className="text-xs text-neutral-500">
                      Uploaded on {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <button 
                  className="text-primary-600 hover:text-primary-800 text-sm"
                  onClick={() => {
                    // In a real app, this would open/download the document
                    showNotification('Document viewer would open here', 'info')
                  }}
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
        
        {loan.status === 'review' && loanDocuments.length > 0 && user.role === 'agent' && (
          <div className="p-6 bg-neutral-50 border-t border-neutral-200">
            <button 
              className="btn-primary"
              onClick={() => {
                setSelectedStatus('credit_investigation')
                setIsStatusModalOpen(true)
              }}
            >
              <FaUserCheck className="mr-2 h-4 w-4" />
              Send to Credit Investigation
            </button>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
          <h2 className="font-medium text-neutral-800">Actions</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            {getAvailableStatusTransitions().includes('ci_approved') && (
              <button 
                className="btn-success"
                onClick={() => {
                  setSelectedStatus('ci_approved')
                  setIsStatusModalOpen(true)
                }}
              >
                <FaCheck className="mr-2 h-4 w-4" />
                Approve Credit Investigation
              </button>
            )}
            
            {getAvailableStatusTransitions().includes('ci_rejected') && (
              <button 
                className="btn-danger"
                onClick={() => {
                  setSelectedStatus('ci_rejected')
                  setIsStatusModalOpen(true)
                }}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Reject Credit Investigation
              </button>
            )}
            
            {getAvailableStatusTransitions().includes('processing') && (
              <button 
                className="btn-primary"
                onClick={() => {
                  setSelectedStatus('processing')
                  setIsStatusModalOpen(true)
                }}
              >
                <FaFileAlt className="mr-2 h-4 w-4" />
                Send to Processing
              </button>
            )}
            
            {getAvailableStatusTransitions().includes('released') && (
              <button 
                className="btn-success"
                onClick={() => {
                  setSelectedStatus('released')
                  setIsStatusModalOpen(true)
                }}
              >
                <FaMoneyBill className="mr-2 h-4 w-4" />
                Release Loan
              </button>
            )}
            
            {getAvailableStatusTransitions().includes('rejected') && (
              <button 
                className="btn-danger"
                onClick={() => {
                  setSelectedStatus('rejected')
                  setIsStatusModalOpen(true)
                }}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Reject Loan
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Status Change Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-neutral-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-800">
                Change Loan Status
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-neutral-600 mb-2">
                  Are you sure you want to change the status to{' '}
                  <span className="font-medium">{loanStatusConfig[selectedStatus]?.label || selectedStatus}</span>?
                </p>
                <div className="mt-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                    Add Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows="3"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="input-field"
                    placeholder="Add any relevant notes about this status change..."
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsStatusModalOpen(false)
                    setStatusNotes('')
                  }}
                >
                  Cancel
                </button>
                <button
                  className={
                    selectedStatus === 'rejected' || selectedStatus === 'ci_rejected'
                      ? 'btn-danger'
                      : 'btn-primary'
                  }
                  onClick={() => handleStatusChange(selectedStatus)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanDetails