import { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { initialLoans } from '../data/demoData'

const LoanContext = createContext(null)

export const useLoan = () => useContext(LoanContext)

export function LoanProvider({ children }) {
  const [loans, setLoans] = useState([])
  const [documents, setDocuments] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  // Initialize demo data
  useEffect(() => {
    const storedLoans = localStorage.getItem('loans')
    if (!storedLoans) {
      localStorage.setItem('loans', JSON.stringify(initialLoans))
      setLoans(initialLoans)
    } else {
      setLoans(JSON.parse(storedLoans))
    }

    const storedDocs = localStorage.getItem('documents')
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs))
    }

    const storedPayments = localStorage.getItem('payments')
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments))
    }

    setLoading(false)
  }, [])

  const saveLoans = (updatedLoans) => {
    setLoans(updatedLoans)
    localStorage.setItem('loans', JSON.stringify(updatedLoans))
  }

  const saveDocuments = (updatedDocuments) => {
    setDocuments(updatedDocuments)
    localStorage.setItem('documents', JSON.stringify(updatedDocuments))
  }

  const savePayments = (updatedPayments) => {
    setPayments(updatedPayments)
    localStorage.setItem('payments', JSON.stringify(updatedPayments))
  }

  // Create a new loan application
  const createLoan = (loanData) => {
    const newLoan = {
      id: `loan_${uuidv4()}`,
      ...loanData,
      status: 'initial_review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedLoans = [...loans, newLoan]
    saveLoans(updatedLoans)
    return newLoan
  }

  // Update loan status
  const updateLoanStatus = (loanId, newStatus, notes = '') => {
    const updatedLoans = loans.map(loan => {
      if (loan.id === loanId) {
        return {
          ...loan,
          status: newStatus,
          statusHistory: [
            ...(loan.statusHistory || []),
            {
              status: newStatus,
              date: new Date().toISOString(),
              notes
            }
          ],
          updatedAt: new Date().toISOString()
        }
      }
      return loan
    })

    saveLoans(updatedLoans)
    return updatedLoans.find(loan => loan.id === loanId)
  }

  // Update loan details
  const updateLoan = (loanId, updatedData) => {
    const updatedLoans = loans.map(loan => {
      if (loan.id === loanId) {
        return {
          ...loan,
          ...updatedData,
          updatedAt: new Date().toISOString()
        }
      }
      return loan
    })

    saveLoans(updatedLoans)
    return updatedLoans.find(loan => loan.id === loanId)
  }

  // Upload a document for a loan
  const uploadDocument = (loanId, documentData) => {
    const newDocument = {
      id: `doc_${uuidv4()}`,
      loanId,
      ...documentData,
      uploadedAt: new Date().toISOString()
    }

    const updatedDocuments = [...documents, newDocument]
    saveDocuments(updatedDocuments)
    return newDocument
  }

  // Record a payment for a loan
  const recordPayment = (loanId, paymentData) => {
    const newPayment = {
      id: `payment_${uuidv4()}`,
      loanId,
      ...paymentData,
      date: new Date().toISOString()
    }

    const updatedPayments = [...payments, newPayment]
    savePayments(updatedPayments)
    return newPayment
  }

  // Get documents for a specific loan
  const getLoanDocuments = (loanId) => {
    return documents.filter(doc => doc.loanId === loanId)
  }

  // Get payments for a specific loan
  const getLoanPayments = (loanId) => {
    return payments.filter(payment => payment.loanId === loanId)
  }

  const value = {
    loans,
    documents,
    payments,
    loading,
    createLoan,
    updateLoanStatus,
    updateLoan,
    uploadDocument,
    recordPayment,
    getLoanDocuments,
    getLoanPayments
  }

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  )
}