import { useState } from 'react'

function PhoneInput({ value, onChange, className = '', ...props }) {
  const [displayValue, setDisplayValue] = useState(value || '')

  const handleChange = (e) => {
    let input = e.target.value
    
    // Remove all non-numeric characters
    input = input.replace(/\D/g, '')
    
    // Limit to 10 digits (excluding country code)
    input = input.substring(0, 10)
    
    // Format as Philippine mobile number
    if (input.length > 0) {
      input = `+63${input}`
    }
    
    setDisplayValue(input)
    onChange(input)
  }

  return (
    <div className="relative">
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder="+63 XXX XXX XXXX"
        className={className}
        {...props}
      />
    </div>
  )
}

export default PhoneInput