import { useState, useEffect } from 'react'

export const usePropertyData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        const response = await fetch('/properties.json')
        if (!response.ok) {
          throw new Error(`Failed to load properties.json: ${response.status} ${response.statusText}`)
        }
        const propertiesData = await response.json()
        if (!cancelled) {
          setData(propertiesData)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    loadData()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
