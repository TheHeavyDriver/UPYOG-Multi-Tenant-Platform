import React from 'react'
import './TenantFilter.css'

const TENANTS = ['All Cities', 'Delhi', 'Mumbai', 'Pune', 'Bengaluru', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow']

const TenantFilter = ({ selectedTenant, onTenantChange }) => {
  return (
    <div className="tenant-filter glass-card">
      <label className="filter-label" htmlFor="tenant-select">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Select City
      </label>
      <select
        id="tenant-select"
        className="filter-select"
        value={selectedTenant}
        onChange={(e) => onTenantChange(e.target.value)}
      >
        {TENANTS.map((tenant) => (
          <option key={tenant} value={tenant}>
            {tenant}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TenantFilter
