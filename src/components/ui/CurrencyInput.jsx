import { useState, useEffect } from 'react'
import { formatCurrency } from '../../data/demoData'

function CurrencyInput({ value, onChange, placeholder = '0.00', className = '', ...props }) {
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    if (value) {
      setDisplayValue(value.toString())
    }
  }, [value])

  const handleChange = (e) => {
    const input = e.target.value
    // Remove all non-numeric characters except decimal point
    const numericValue = input.replace(/[^0-9.]/g, '')
    
    // Ensure only one decimal point
    const parts = numericValue.split('.')
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '')
    
    setDisplayValue(sanitizedValue)
    onChange(parseFloat(sanitizedValue) || 0)
  }

  const handleBlur = () => {
    if (displayValue) {
      const numericValue = parseFloat(displayValue)
      setDisplayValue(formatCurrency(numericValue).replace('PHP', '').trim())
    }
  }

  const handleFocus = () => {
    // Remove formatting on focus
    if (displayValue) {
      setDisplayValue(parseFloat(displayValue.replace(/[^0-9.]/g, '')).toString())
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-neutral-500">₱</span>
      </div>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={`pl-7 ${className}`}
        {...props}
      />
    </div>
  )
}

export default CurrencyInput