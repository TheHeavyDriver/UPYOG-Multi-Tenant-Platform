// Data filtering and aggregation utilities

// Get all unique cities from the dataset
export const getCities = (data) => {
  const cities = [...new Set(data.map(p => p.tenant))]
  return cities.sort()
}

// Filter data by tenant
export const filterByTenant = (data, tenant) => {
  if (tenant === 'All Cities') return data
  return data.filter(p => p.tenant === tenant)
}

// Compute KPI values from filtered data
export const computeKPIs = (data) => ({
  totalProperties: data.length,
  totalApproved: data.filter(p => p.status === 'Approved').length,
  totalRejected: data.filter(p => p.status === 'Rejected').length,
  totalCollection: data.reduce((sum, p) => sum + p.collection_inr, 0)
})

// Compute per-city summaries for charts
export const computeCitySummaries = (data) => {
  const cities = getCities(data)
  return cities.map(city => {
    const cityData = data.filter(p => p.tenant === city)
    return {
      city,
      total: cityData.length,
      approved: cityData.filter(p => p.status === 'Approved').length,
      rejected: cityData.filter(p => p.status === 'Rejected').length,
      pending: cityData.filter(p => p.status === 'Pending').length,
      totalCollection: cityData.reduce((sum, p) => sum + p.collection_inr, 0),
      avgTax: cityData.reduce((sum, p) => sum + p.annual_tax_inr, 0) / cityData.length || 0
    }
  })
}

// Generate a text summary for the AI context
export const generateDataSummary = (data) => {
  const cities = getCities(data)
  const summaries = computeCitySummaries(data)
  const overallKPIs = computeKPIs(data)

  const cityLines = summaries.map(s =>
    `- ${s.city}: ${s.total} properties (${s.approved} approved, ${s.rejected} rejected, ${s.pending} pending), Total Collection: Rs.${s.totalCollection.toLocaleString('en-IN', {maximumFractionDigits: 0})}`
  ).join('\n')

  const topCollection = [...summaries].sort((a, b) => b.totalCollection - a.totalCollection)[0]
  const topApproved = [...summaries].sort((a, b) => b.approved - a.approved)[0]
  const topRejected = [...summaries].sort((a, b) => b.rejected - a.rejected)[0]
  const topPending = [...summaries].sort((a, b) => b.pending - a.pending)[0]

  return `Property Tax Data Summary for UPYOG Platform:

Overall Statistics:
- Total Properties: ${overallKPIs.totalProperties}
- Total Approved: ${overallKPIs.totalApproved}
- Total Rejected: ${overallKPIs.totalRejected}
- Total Pending: ${overallKPIs.totalProperties - overallKPIs.totalApproved - overallKPIs.totalRejected}
- Total Collection: Rs.${overallKPIs.totalCollection.toLocaleString('en-IN', {maximumFractionDigits: 2})}

Per-City Breakdown:
${cityLines}

Key Insights:
- Highest Collection: ${topCollection.city} (Rs.${topCollection.totalCollection.toLocaleString('en-IN', {maximumFractionDigits: 0})})
- Most Approved: ${topApproved.city} (${topApproved.approved} properties)
- Most Rejected: ${topRejected.city} (${topRejected.rejected} properties)
- Most Pending: ${topPending.city} (${topPending.pending} properties)`
}

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

// Format large numbers with Indian numbering system
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}
