import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'

/**
 * Auth Context for global authentication state
 */
const AuthContext = createContext()

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await API.post('/auth/register', userData)
      const { data } = response.data

      setUser(data.user)
      setToken(data.token)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      return data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      const response = await API.post('/auth/login', credentials)
      const { data } = response.data

      setUser(data.user)
      setToken(data.token)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      return data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /**
   * Get current user profile
   */
  const getProfile = async () => {
    try {
      setLoading(true)
      const response = await API.get('/auth/profile')
      const { data } = response.data

      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))

      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth hook - use in components
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
