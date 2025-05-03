import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLoan } from '../../contexts/LoanContext'
import { format } from 'date-fns'
import { FaMoneyBill, FaFile as FaFileAlt, FaCheck } from 'react-icons/fa6'

function Payments() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { loans, payments, recordPayment, getLoanPayments } = useLoan()
  const { showNotification } = useOutletContext()
  
  const [loan, setLoan] = useState(null)
  const [loanPayments, setLoanPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  })
  
  useEffect(() => {
    if (loans.length > 0) {
      const foundLoan = loans.find(l => l.id === id)
      if (foundLoan) {
        setLoan(foundLoan)
        setLoanPayments(getLoanPayments(id))
      }
      setLoading(false)
    }
  }, [id, loans, payments, getLoanPayments])
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    
    try {
      const payment = recordPayment(loan.id, {
        ...paymentData,
        amount: parseFloat(paymentData.amount)
      })
      
      setLoanPayments([...loanPayments, payment])
      setIsPaymentModalOpen(false)
      setPaymentData({
        amount: '',
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      })
      
      showNotification('Payment recorded successfully', 'success')
    } catch (error) {
      showNotification('Failed to record payment', 'error')
      console.error(error)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4">Loading payment details...</p>
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
            Payment History
          </h1>
          <p className="text-neutral-500 mt-1">
            Loan ID: {loan.id}
          </p>
        </div>
        {user.role === 'agent' && (
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="btn-primary"
          >
            <FaMoneyBill className="mr-2 h-4 w-4" />
            Record Payment
          </button>
        )}
      </div>
      
      {/* Loan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Loan Amount</h3>
          <p className="text-2xl font-semibold text-neutral-800">
            ${loan.amount?.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Monthly Payment</h3>
          <p className="text-2xl font-semibold text-neutral-800">
            ${loan.monthlyPayment?.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Total Paid</h3>
          <p className="text-2xl font-semibold text-neutral-800">
            ${loanPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="font-medium text-neutral-800">Payment History</h2>
        </div>
        
        {loanPayments.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">
            No payments recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {loanPayments.map((payment, index) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {format(new Date(payment.date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {format(new Date(payment.date), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        ${payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-600">
                        {payment.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-100 text-accent-800">
                        <FaCheck className="mr-1 h-3 w-3" /> Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-neutral-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-800">
                Record Payment
              </h3>
            </div>
            <form onSubmit={handlePaymentSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
                    Payment Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-neutral-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      step="0.01"
                      required
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                      className="input-field pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="paymentDate" className="block text-sm font-medium text-neutral-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    id="paymentDate"
                    name="paymentDate"
                    required
                    value={paymentData.paymentDate}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    className="input-field"
                    placeholder="Add any notes about this payment..."
                  ></textarea>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payments