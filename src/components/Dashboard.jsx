import React, { useState, useMemo } from 'react'
import TenantFilter from './TenantFilter'
import KPICard from './KPICard'
import ComparisonChart from './ComparisonChart'
import AIChat from './AIChat'
import {
  filterByTenant,
  computeKPIs,
  computeCitySummaries,
  generateDataSummary
} from '../utils/dataUtils'
import './Dashboard.css'

const Dashboard = ({ data, loading, error }) => {
  const [selectedTenant, setSelectedTenant] = useState('All Cities')

  // Filter data based on selected tenant
  const filteredData = useMemo(() => {
    if (!data) return []
    return filterByTenant(data, selectedTenant)
  }, [data, selectedTenant])

  // Compute KPIs from filtered data
  const kpis = useMemo(() => {
    if (!data) return { totalProperties: 0, totalApproved: 0, totalRejected: 0, totalCollection: 0 }
    return computeKPIs(filteredData)
  }, [filteredData])

  // Compute city summaries (always use full data for comparison chart)
  const citySummaries = useMemo(() => {
    if (!data) return []
    return computeCitySummaries(data)
  }, [data])

  // Generate data summary for AI (always use full data)
  const dataSummary = useMemo(() => {
    if (!data) return ''
    return generateDataSummary(data)
  }, [data])

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Failed to load data</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header fade-in">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
            <div>
              <h1 className="header-title">UPYOG Property Tax Analytics</h1>
              <p className="header-subtitle">Multi-Tenant Dashboard &bull; NUDM Platform 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Tenant filter */}
        <div className="filter-section fade-in">
          <TenantFilter selectedTenant={selectedTenant} onTenantChange={setSelectedTenant} />
        </div>

        {/* KPI Cards */}
        <section className="kpi-section">
          <div className="kpi-grid">
            <KPICard
              title="Total Properties"
              value={kpis.totalProperties}
              type="total"
              loading={loading}
            />
            <KPICard
              title="Approved"
              value={kpis.totalApproved}
              type="approved"
              loading={loading}
            />
            <KPICard
              title="Rejected"
              value={kpis.totalRejected}
              type="rejected"
              loading={loading}
            />
            <KPICard
              title="Total Collection"
              value={kpis.totalCollection}
              type="collection"
              loading={loading}
            />
          </div>
        </section>

        {/* Comparison Chart */}
        {!loading && citySummaries.length > 0 && (
          <section className="chart-section">
            <ComparisonChart citySummaries={citySummaries} />
          </section>
        )}

        {/* Loading state for chart */}
        {loading && (
          <section className="chart-section">
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '12px' }} />
            </div>
          </section>
        )}
      </main>

      {/* AI Chat Assistant */}
      {!loading && data && <AIChat data={data} dataSummary={dataSummary} citySummaries={citySummaries} />}

      {/* Footer */}
      <footer className="dashboard-footer fade-in">
        <p>UPYOG Multi-Tenant Platform &copy; 2026 &bull; National Urban Data Management</p>
      </footer>
    </div>
  )
}

export default Dashboard
