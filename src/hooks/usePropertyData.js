import { useState, useEffect } from 'react'
import propertiesData from '../properties.json'

// Custom hook for loading and managing property data
export const usePropertyData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate brief loading for UX
        await new Promise(resolve => setTimeout(resolve, 800))
        setData(propertiesData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}
