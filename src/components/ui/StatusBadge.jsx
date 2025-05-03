import { loanStatusConfig } from '../../data/demoData'

function StatusBadge({ status }) {
  const config = loanStatusConfig[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    color: 'bg-neutral-500',
    description: 'Status'
  }

  return (
    <span 
      className={`${config.color} text-white px-2.5 py-0.5 rounded-full text-xs font-medium`}
      title={config.description}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge