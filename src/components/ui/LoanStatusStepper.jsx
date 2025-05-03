import { motion } from 'framer-motion'
import { loanStatusConfig } from '../../data/demoData'

const loanSteps = [
  'initial_review',
  'review',
  'credit_investigation',
  'ci_approved',
  'processing',
  'released',
  'closed'
]

function LoanStatusStepper({ currentStatus, statusHistory = [] }) {
  // Find the current step index
  const currentStepIndex = loanSteps.indexOf(currentStatus)
  
  // Check if loan is rejected
  const isRejected = currentStatus === 'rejected' || currentStatus === 'ci_rejected'
  
  // Status timeline
  const statusTimeline = statusHistory.length > 0 
    ? statusHistory.map(history => ({
        status: history.status,
        date: new Date(history.date).toLocaleDateString(),
        notes: history.notes
      }))
    : []
  
  return (
    <div className="w-full my-6">
      {/* Stepper */}
      <div className="relative">
        <div className="overflow-hidden md:overflow-visible">
          <div className="flex items-center relative">
            {loanSteps.map((step, index) => {
              const config = loanStatusConfig[step]
              const isPassed = index <= currentStepIndex && !isRejected
              const isCurrent = index === currentStepIndex && !isRejected
              
              return (
                <div key={step} className="flex-1 relative">
                  {/* Connecting line */}
                  {index < loanSteps.length - 1 && (
                    <>
                      {/* Background line */}
                      <div className="absolute top-4 left-5 right-5 h-0.5 bg-neutral-200"></div>
                      
                      {/* Progress line */}
                      {isPassed && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`absolute top-4 left-5 right-5 h-0.5 origin-left ${
                            isRejected ? 'bg-warning-500' : 'bg-primary-500'
                          }`}
                        ></motion.div>
                      )}
                    </>
                  )}
                  
                  {/* Step circle */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: isCurrent ? 1.2 : 1, 
                        opacity: isPassed ? 1 : 0.5 
                      }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-full h-8 w-8 flex items-center justify-center relative z-10 ${
                        isPassed 
                          ? isRejected && isCurrent
                            ? 'bg-warning-500 text-white' 
                            : 'bg-primary-500 text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
                    >
                      {isPassed ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </motion.div>
                    
                    {/* Step label */}
                    <span className={`text-xs mt-2 text-center hidden md:block ${
                      isPassed ? 'text-neutral-800 font-medium' : 'text-neutral-500'
                    }`}>
                      {config?.label || step}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Reject indicator (if rejected) */}
        {isRejected && (
          <div className="absolute top-0 right-0 -mt-3 -mr-2">
            <span className="bg-warning-500 text-white text-xs px-2 py-1 rounded-full">
              Rejected
            </span>
          </div>
        )}
      </div>
      
      {/* Status timeline */}
      {statusTimeline.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-200 divide-y divide-neutral-100">
          <div className="px-4 py-3 bg-neutral-50">
            <h3 className="text-sm font-medium text-neutral-800">Status History</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {statusTimeline.map((item, index) => (
              <div key={index} className="px-4 py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-neutral-800">
                    {loanStatusConfig[item.status]?.label || item.status}
                  </span>
                  <span className="text-xs text-neutral-500">{item.date}</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-neutral-600 mt-1">{item.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanStatusStepper