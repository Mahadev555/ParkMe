import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './hooks/useToast.jsx'
import { Navbar, ToastContainer } from './components'
import ChatWidget from './components/ChatWidget'
import ProtectedRoute from './components/ProtectedRoute'
import { useToast } from './hooks/useToast.jsx'
import {
  LandingPage,
  LoginPage,
  RegisterPage,
  SearchPage,
  ParkingDetailsPage,
  OwnerParkingPage,
  MyBookingsPage,
  PaymentPage,
  TrendingPage,
  ProfilePage,
} from './pages'

/**
 * Page Transition Animation
 */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

/**
 * App Content Component (inside providers)
 */
function AppContent() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <ChatWidget />

      <main className="pt-16">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/search/trending" element={<PageTransition><TrendingPage /></PageTransition>} />

            {/* User Routes (Protected) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition><ProfilePage /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Driver Routes (Protected) */}
            <Route
              path="/search"
              element={
                <ProtectedRoute requiredRole="driver">
                  <PageTransition><SearchPage /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parking/:id"
              element={
                <ProtectedRoute requiredRole="driver">
                  <PageTransition><ParkingDetailsPage /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/booking/:bookingId"
              element={
                <ProtectedRoute requiredRole="driver">
                  <PageTransition><PaymentPage /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute requiredRole="driver">
                  <PageTransition><MyBookingsPage /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Owner Routes (Protected) */}
            <Route
              path="/owner/parking"
              element={
                <ProtectedRoute requiredRole="owner">
                  <PageTransition><OwnerParkingPage /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Catch-all - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

/**
 * Main App Component with Providers
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
