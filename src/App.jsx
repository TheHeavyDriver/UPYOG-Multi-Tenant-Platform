import React from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './components/Dashboard'
import { usePropertyData } from './hooks/usePropertyData'

const App = () => {
  const { data, loading, error } = usePropertyData()

  return (
    <ErrorBoundary>
      <Dashboard data={data} loading={loading} error={error} />
    </ErrorBoundary>
  )
}

export default App
