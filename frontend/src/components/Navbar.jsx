import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * Navigation Bar Component
 * Responsive design with mobile menu and glassmorphism
 */
export const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Trending', href: '/search/trending' },
    { name: 'Find Parking', href: '/search', requireAuth: true, driverOnly: true },
    { name: 'My Bookings', href: '/bookings', requireAuth: true, driverOnly: true },
    { name: 'My Parking', href: '/owner/parking', requireAuth: true, ownerOnly: true },
  ]

  const filteredNavItems = navItems.filter(item => {
    if (item.requireAuth && !isAuthenticated) return false
    if (item.ownerOnly && user?.role !== 'owner') return false
    if (item.driverOnly && user?.role !== 'driver') return false
    return true
  })

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
            >
              🅿 ParkMe
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200"
                >
                  {user?.name}
                </button>
                <span className="text-xs font-semibold text-primary-600">
                  {user?.role}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50/50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} className="text-red-600" />
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/20 py-4 space-y-2 bg-white/50"
          >
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-2 text-slate-700 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate('/profile')
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-slate-700 hover:bg-primary-50 rounded-lg transition-colors border-t border-white/20 mt-4 pt-4"
                >
                  {user?.name} ({user?.role})
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-4 border-t border-white/20 mt-4">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
