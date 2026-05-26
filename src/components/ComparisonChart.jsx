import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './ComparisonChart.css'

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip glass-card" style={{ padding: '0.75rem 1rem' }}>
        <p className="tooltip-label" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: '0.25rem 0' }}>
            {entry.name}: Rs.{entry.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const ComparisonChart = ({ citySummaries }) => {
  // Format data for the chart
  const chartData = citySummaries.map(city => ({
    name: city.city,
    'Total Collection': Math.round(city.totalCollection),
    'Approved': city.approved,
    'Rejected': city.rejected,
    'Pending': city.pending
  }))

  return (
    <div className="comparison-chart glass-card fade-in">
      <div className="chart-header">
        <h2 className="chart-title">City Comparison Dashboard</h2>
        <p className="chart-subtitle">Total collection and property status across all cities</p>
      </div>

      <div className="chart-container">
        <div className="chart-section">
          <h3 className="section-title">Total Collection by City</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `Rs.${(value / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                dataKey="Total Collection"
                fill="#1a56db"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3 className="section-title">Property Status Distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="chart-tooltip glass-card" style={{ padding: '0.75rem 1rem' }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.fill, margin: '0.25rem 0' }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                dataKey="Approved"
                stackId="status"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="Rejected"
                stackId="status"
                fill="#ef4444"
                radius={[0, 0, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="Pending"
                stackId="status"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ComparisonChart
