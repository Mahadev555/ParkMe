import { useState, useCallback, createContext, useContext } from 'react'

/**
 * useToast Hook
 * Manages toast notifications
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (message) => addToast(message, 'success', 4000),
    [addToast]
  )

  const error = useCallback(
    (message) => addToast(message, 'error', 5000),
    [addToast]
  )

  const info = useCallback(
    (message) => addToast(message, 'info', 4000),
    [addToast]
  )

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  }
}

/**
 * Toast Context for global access
 */
const ToastContext = createContext()

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const toast = useToast()
  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  )
}
