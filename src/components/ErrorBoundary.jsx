import React from 'react'

// Error boundary for catching rendering errors gracefully
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          padding: '2rem',
          textAlign: 'center',
          background: '#fef2f2',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          margin: '1rem'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#6b7280' }}>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
