import { formatCurrency, formatNumber } from './dataUtils'

// Local rule-based AI that answers questions without any API key
export const localAnswer = (question, data, summaries) => {
  const q = question.toLowerCase()

  // Helper: find city mention
  const cityNames = summaries.map(s => s.city.toLowerCase())
  const mentionedCity = summaries.find(s => q.includes(s.city.toLowerCase()))

  // Helper: get summary for a city
  const cityData = (name) => summaries.find(s => s.city.toLowerCase() === name.toLowerCase())

  // --- Which city has highest/lowest collection? ---
  if (q.includes('highest') && (q.includes('collection') || q.includes('tax') || q.includes('most') && q.includes('collect'))) {
    const sorted = [...summaries].sort((a, b) => b.totalCollection - a.totalCollection)
    return `${sorted[0].city} has the highest total collection at ${formatCurrency(sorted[0].totalCollection)}.`
  }
  if (q.includes('lowest') && (q.includes('collection') || q.includes('tax'))) {
    const sorted = [...summaries].sort((a, b) => a.totalCollection - b.totalCollection)
    return `${sorted[0].city} has the lowest total collection at ${formatCurrency(sorted[0].totalCollection)}.`
  }

  // --- Most approved / rejected / pending city ---
  if (q.includes('most') && q.includes('approved')) {
    const sorted = [...summaries].sort((a, b) => b.approved - a.approved)
    return `${sorted[0].city} has the most approved properties with ${formatNumber(sorted[0].approved)} properties.`
  }
  if (q.includes('most') && q.includes('reject')) {
    const sorted = [...summaries].sort((a, b) => b.rejected - a.rejected)
    return `${sorted[0].city} has the most rejected properties with ${formatNumber(sorted[0].rejected)} properties.`
  }
  if (q.includes('most') && q.includes('pending')) {
    const sorted = [...summaries].sort((a, b) => b.pending - a.pending)
    return `${sorted[0].city} has the most pending properties with ${formatNumber(sorted[0].pending)} properties.`
  }

  // --- How many rejected/approved/pending in [city]? ---
  if (mentionedCity) {
    const c = cityData(mentionedCity.city)
    if (q.includes('reject')) {
      return `${c.city} has ${formatNumber(c.rejected)} rejected properties out of ${formatNumber(c.total)} total.`
    }
    if (q.includes('approv')) {
      const pct = ((c.approved / c.total) * 100).toFixed(1)
      return `${c.city} has ${formatNumber(c.approved)} approved properties (${pct}% of ${formatNumber(c.total)} total).`
    }
    if (q.includes('pending')) {
      return `${c.city} has ${formatNumber(c.pending)} pending properties out of ${formatNumber(c.total)} total.`
    }
    if (q.includes('collection') || q.includes('tax')) {
      return `${c.city} has a total collection of ${formatCurrency(c.totalCollection)} across ${formatNumber(c.total)} properties.`
    }
    if (q.includes('how many') || q.includes('total') || q.includes('count')) {
      return `${c.city} has ${formatNumber(c.total)} total properties (${formatNumber(c.approved)} approved, ${formatNumber(c.rejected)} rejected, ${formatNumber(c.pending)} pending).`
    }
    if (q.includes('percentage') || q.includes('%')) {
      const approvedPct = ((c.approved / c.total) * 100).toFixed(1)
      const rejectedPct = ((c.rejected / c.total) * 100).toFixed(1)
      const pendingPct = ((c.pending / c.total) * 100).toFixed(1)
      return `${c.city}: Approved ${approvedPct}%, Rejected ${rejectedPct}%, Pending ${pendingPct}% of ${formatNumber(c.total)} properties.`
    }
    // General city query
    return `${c.city}: ${formatNumber(c.total)} properties, ${formatNumber(c.approved)} approved, ${formatNumber(c.rejected)} rejected, ${formatNumber(c.pending)} pending. Total collection: ${formatCurrency(c.totalCollection)}.`
  }

  // --- Compare two cities ---
  const cities = summaries.map(s => s.city)
  const matchedCities = cities.filter(name => q.includes(name.toLowerCase()))
  if (matchedCities.length >= 2) {
    const c1 = cityData(matchedCities[0])
    const c2 = cityData(matchedCities[1])
    return `Comparison:\n• ${c1.city}: ${formatNumber(c1.total)} properties, ${formatNumber(c1.approved)} approved, ${formatNumber(c1.rejected)} rejected, ${formatNumber(c1.pending)} pending, Collection: ${formatCurrency(c1.totalCollection)}\n• ${c2.city}: ${formatNumber(c2.total)} properties, ${formatNumber(c2.approved)} approved, ${formatNumber(c2.rejected)} rejected, ${formatNumber(c2.pending)} pending, Collection: ${formatCurrency(c2.totalCollection)}\n${c1.totalCollection > c2.totalCollection ? `${c1.city} has higher collection.` : `${c2.city} has higher collection.`}`
  }

  // --- Overall stats ---
  if (q.includes('total') && q.includes('propert')) {
    const total = summaries.reduce((s, c) => s + c.total, 0)
    return `There are ${formatNumber(total)} total properties across all 10 cities.`
  }
  if (q.includes('total') && (q.includes('collection') || q.includes('revenue'))) {
    const total = summaries.reduce((s, c) => s + c.totalCollection, 0)
    return `The total collection across all cities is ${formatCurrency(total)}.`
  }
  if (q.includes('average') && q.includes('tax')) {
    const avg = summaries.reduce((s, c) => s + c.avgTax, 0) / summaries.length
    return `The average annual tax per property across all cities is ${formatCurrency(avg)}.`
  }

  // --- Top N cities ---
  if (q.includes('top') && (q.includes('city') || q.includes('cities'))) {
    const n = q.match(/top (\d+)/) ? parseInt(q.match(/top (\d+)/)[1]) : 5
    const sorted = [...summaries].sort((a, b) => b.totalCollection - a.totalCollection).slice(0, n)
    return `Top ${n} cities by collection:\n${sorted.map((c, i) => `${i + 1}. ${c.city}: ${formatCurrency(c.totalCollection)}`).join('\n')}`
  }

  // --- Property type stats ---
  if (q.includes('residential') || q.includes('commercial') || q.includes('industrial')) {
    const type = q.includes('residential') ? 'Residential' : q.includes('commercial') ? 'Commercial' : 'Industrial'
    const filtered = data.filter(p => p.property_type === type)
    const byCity = summaries.map(s => ({
      city: s.city,
      count: filtered.filter(p => p.tenant === s.city).length
    })).sort((a, b) => b.count - a.count)
    return `${type} properties: ${formatNumber(filtered.length)} total.\n${byCity.slice(0, 3).map(c => `• ${c.city}: ${formatNumber(c.count)}`).join('\n')}`
  }

  // Fallback
  return `I can answer questions about:\n• City-wise property counts and collection\n• Approved/Rejected/Pending stats\n• Comparisons between cities\n• Overall totals and averages\n\nTry asking "Which city has the highest collection?" or "How many properties are rejected in Delhi?"`
}
