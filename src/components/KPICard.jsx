import React, { useState, useEffect } from 'react'
import { formatCurrency } from '../utils/dataUtils'
import './KPICard.css'

// Animated number display component
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.round(increment * step))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <span>{displayValue.toLocaleString('en-IN')}</span>
}

const iconMap = {
  total: '🏛️',
  approved: '✅',
  rejected: '❌',
  collection: '💰'
}

const colorMap = {
  total: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  approved: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  rejected: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  collection: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' }
}

const KPICard = ({ title, value, type, loading }) => {
  const colors = colorMap[type] || colorMap.total
  const icon = iconMap[type] || '📊'

  if (loading) {
    return (
      <div className="kpi-card glass-card" style={{ padding: '1.5rem' }}>
        <div className="kpi-header" style={{ marginBottom: '1rem' }}>
          <div className="kpi-icon skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <div className="kpi-title skeleton" style={{ height: '16px', width: '60%' }} />
        </div>
        <div className="kpi-value skeleton" style={{ height: '32px', width: '50%' }} />
      </div>
    )
  }

  return (
    <div
      className="kpi-card glass-card animate-in"
      style={{
        padding: '1.5rem'
      }}
    >
      <div className="kpi-header">
        <div
          className="kpi-icon"
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`
          }}
        >
          {icon}
        </div>
        <span className="kpi-title">{title}</span>
      </div>
      <div className="kpi-value" style={{ color: colors.text }}>
        {type === 'collection' ? formatCurrency(value) : <AnimatedNumber value={value} />}
      </div>
    </div>
  )
}

export default KPICard
