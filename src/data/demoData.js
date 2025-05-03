// Demo data for the application

// Initial users
export const initialUsers = [
  {
    id: 'user_1',
    name: 'Juan Dela Cruz',
    email: 'agent@example.com',
    password: 'password',
    role: 'agent',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'user_2',
    name: 'Maria Santos',
    email: 'investigator@example.com',
    password: 'password',
    role: 'credit_investigator',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    createdAt: '2023-01-02T00:00:00.000Z'
  },
  {
    id: 'user_3',
    name: 'Ramon Garcia',
    email: 'finance@example.com',
    password: 'password',
    role: 'finance_officer',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    createdAt: '2023-01-03T00:00:00.000Z'
  },
  {
    id: 'user_4',
    name: 'Ana Reyes',
    email: 'client@example.com',
    password: 'password',
    role: 'client',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-01-04T00:00:00.000Z'
  }
]

// Initial loan applications
export const initialLoans = [
  {
    id: 'loan_1',
    clientId: 'user_4',
    clientName: 'Ana Reyes',
    agentId: 'user_1',
    amount: 50000,
    term: 12, // months
    interestRate: 12, // percentage
    purpose: 'Small business capital',
    status: 'review',
    monthlyPayment: 4442.45,
    totalPayable: 53309.40,
    statusHistory: [
      {
        status: 'initial_review',
        date: '2023-02-01T00:00:00.000Z',
        notes: 'Application submitted'
      },
      {
        status: 'review',
        date: '2023-02-05T00:00:00.000Z',
        notes: 'Initial review completed'
      }
    ],
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2023-02-05T00:00:00.000Z'
  },
  {
    id: 'loan_2',
    clientId: 'client_2',
    clientName: 'Roberto Cruz',
    agentId: 'user_1',
    amount: 25000,
    term: 6, // months
    interestRate: 10, // percentage
    purpose: 'Education expenses',
    status: 'credit_investigation',
    monthlyPayment: 4303.30,
    totalPayable: 25819.80,
    statusHistory: [
      {
        status: 'initial_review',
        date: '2023-01-15T00:00:00.000Z',
        notes: 'Application submitted'
      },
      {
        status: 'review',
        date: '2023-01-20T00:00:00.000Z',
        notes: 'Initial review completed'
      },
      {
        status: 'credit_investigation',
        date: '2023-01-25T00:00:00.000Z',
        notes: 'Documents verified'
      }
    ],
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-25T00:00:00.000Z'
  },
  {
    id: 'loan_3',
    clientId: 'client_3',
    clientName: 'Maria Garcia',
    agentId: 'user_1',
    amount: 100000,
    term: 24, // months
    interestRate: 15, // percentage
    purpose: 'Sari-sari store expansion',
    status: 'processing',
    monthlyPayment: 4852.70,
    totalPayable: 116464.80,
    statusHistory: [
      {
        status: 'initial_review',
        date: '2022-12-10T00:00:00.000Z',
        notes: 'Application submitted'
      },
      {
        status: 'review',
        date: '2022-12-15T00:00:00.000Z',
        notes: 'Initial review completed'
      },
      {
        status: 'credit_investigation',
        date: '2022-12-20T00:00:00.000Z',
        notes: 'Documents verified'
      },
      {
        status: 'ci_approved',
        date: '2022-12-25T00:00:00.000Z',
        notes: 'Credit investigation approved'
      },
      {
        status: 'processing',
        date: '2023-01-05T00:00:00.000Z',
        notes: 'Final review completed'
      }
    ],
    createdAt: '2022-12-10T00:00:00.000Z',
    updatedAt: '2023-01-05T00:00:00.000Z'
  }
]

// Loan status definitions and UI information
export const loanStatusConfig = {
  initial_review: {
    label: 'Initial Review',
    color: 'bg-neutral-500',
    description: 'Application is being reviewed by an agent'
  },
  review: {
    label: 'For Documents',
    color: 'bg-blue-500',
    description: 'Client needs to upload supporting documents'
  },
  credit_investigation: {
    label: 'CI Ongoing',
    color: 'bg-yellow-500',
    description: 'Credit investigator is assessing capacity to pay'
  },
  ci_approved: {
    label: 'CI Approved',
    color: 'bg-green-500',
    description: 'Credit investigation approved, pending final review'
  },
  ci_rejected: {
    label: 'CI Rejected',
    color: 'bg-red-500',
    description: 'Credit investigation rejected'
  },
  processing: {
    label: 'Processing',
    color: 'bg-purple-500',
    description: 'Loan is being processed for release'
  },
  released: {
    label: 'Released',
    color: 'bg-accent-500',
    description: 'Loan amount has been released'
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-warning-500',
    description: 'Loan application was rejected'
  },
  closed: {
    label: 'Closed',
    color: 'bg-neutral-700',
    description: 'Loan has been fully paid'
  }
}

// Currency formatter
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Common loan purposes for Philippines
export const loanPurposes = [
  'Small Business / Negosyo',
  'Education / Tuition',
  'Medical Expenses',
  'Home Improvement',
  'Debt Consolidation',
  'Agricultural',
  'Vehicle Purchase',
  'Wedding / Family Event',
  'Travel / OFW Processing',
  'Gadget Purchase',
  'Other'
]

// Required documents
export const requiredDocuments = [
  {
    name: 'Valid ID',
    description: 'Government-issued ID (e.g., UMID, Passport, Driver\'s License)',
    required: true
  },
  {
    name: 'Proof of Income',
    description: 'Latest payslip, ITR, or business financial statements',
    required: true
  },
  {
    name: 'Proof of Billing',
    description: 'Recent utility bill showing current address',
    required: true
  },
  {
    name: 'Barangay Clearance',
    description: 'Latest Barangay Clearance from your current residence',
    required: true
  },
  {
    name: 'Co-Maker Documents',
    description: 'Valid ID and proof of income of co-maker (if applicable)',
    required: false
  }
]