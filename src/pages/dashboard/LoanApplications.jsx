import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLoan } from '../../contexts/LoanContext'
import { FaPlus, FaMagnifyingGlass as FaSearch, FaFilter, FaArrowDownWideShort as FaSortAmountDown } from 'react-icons/fa6'
import StatusBadge from '../../components/ui/StatusBadge'
import { format } from 'date-fns'

function LoanApplications() {
  const { user } = useAuth()
  const { loans, loading } = useLoan()
  const navigate = useNavigate()
  
  const [filteredLoans, setFilteredLoans] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('updatedAt')
  const [sortDirection, setSortDirection] = useState('desc')
  
  // Filter and sort loans based on user role and filters
  useEffect(() => {
    if (!loading) {
      let filtered = [...loans]
      
      // Filter by user role
      if (user.role === 'client') {
        filtered = filtered.filter(loan => loan.clientId === user.id)
      } else if (user.role === 'credit_investigator') {
        filtered = filtered.filter(loan => loan.status === 'credit_investigation')
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(loan => loan.status === statusFilter)
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(loan => 
          loan.clientName?.toLowerCase().includes(query) ||
          loan.id.toLowerCase().includes(query) ||
          loan.purpose?.toLowerCase().includes(query)
        )
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let aValue = a[sortField]
        let bValue = b[sortField]
        
        // Handle dates
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }
        
        // Handle numbers
        if (sortField === 'amount') {
          aValue = parseFloat(aValue)
          bValue = parseFloat(bValue)
        }
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
      
      setFilteredLoans(filtered)
    }
  }, [loading, loans, user, statusFilter, searchQuery, sortField, sortDirection])
  
  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4">Loading loan applications...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">
            {user.role === 'client' ? 'My Loans' : 'Loan Applications'}
          </h1>
          <p className="text-neutral-500 mt-1">
            {user.role === 'client' 
              ? 'View and manage your loan applications' 
              : user.role === 'credit_investigator'
                ? 'Applications pending credit investigation'
                : 'Manage loan applications and their statuses'}
          </p>
        </div>
        
        {/* Action buttons */}
        {user.role === 'agent' && (
          <Link 
            to="/loan-applications/new" 
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        )}
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search loans..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="h-4 w-4 text-neutral-400" />
          </div>
          <select
            className="input-field pl-10 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="initial_review">Initial Review</option>
            <option value="review">Review</option>
            <option value="credit_investigation">Credit Investigation</option>
            <option value="ci_approved">CI Approved</option>
            <option value="processing">Processing</option>
            <option value="released">Released</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSortAmountDown className="h-4 w-4 text-neutral-400" />
          </div>
          <select
            className="input-field pl-10 appearance-none"
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-')
              setSortField(field)
              setSortDirection(direction)
            }}
          >
            <option value="updatedAt-desc">Latest Updates</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
      </div>
      
      {/* Loans List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-500 mb-4">No loan applications found</p>
            {user.role === 'agent' && (
              <Link to="/loan-applications/new" className="btn-primary">
                Create New Application
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('clientName')}
                  >
                    Client
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Purpose
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('updatedAt')}
                  >
                    Last Update
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredLoans.map((loan) => (
                  <tr 
                    key={loan.id} 
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => {
                      if (user.role === 'client') {
                        navigate(`/client/loans/${loan.id}`)
                      } else if (user.role === 'credit_investigator') {
                        navigate(`/credit-investigation/${loan.id}`)
                      } else {
                        navigate(`/loan-applications/${loan.id}`)
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{loan.clientName}</div>
                      <div className="text-xs text-neutral-500">{loan.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">₱{loan.amount?.toLocaleString()}</div>
                      <div className="text-xs text-neutral-500">{loan.term} months</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 truncate max-w-xs">{loan.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {format(new Date(loan.updatedAt), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {format(new Date(loan.updatedAt), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={
                          user.role === 'client' 
                            ? `/client/loans/${loan.id}` 
                            : user.role === 'credit_investigator'
                              ? `/credit-investigation/${loan.id}`
                              : `/loan-applications/${loan.id}`
                        }
                        className="text-primary-600 hover:text-primary-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoanApplications