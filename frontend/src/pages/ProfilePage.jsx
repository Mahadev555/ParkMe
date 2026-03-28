import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Shield, Calendar, LogOut } from 'lucide-react'
import { Button, Input, Loader } from '../components'
import { useAuth } from '../context/AuthContext'
import { useToastContext } from '../hooks/useToast.jsx'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

/**
 * User Profile Page
 * View and manage user account information
 */
const ProfilePage = () => {
  const navigate = useNavigate()
  const toast = useToastContext()
  const { user, logout, loading: authLoading } = useAuth()

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info('Please log in to view your profile')
      navigate('/login', { replace: true })
    }
  }, [authLoading, user, navigate, toast])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
    navigate('/', { replace: true })
  }

  if (authLoading) return <Loader fullScreen />

  if (!user) {
    return null // Will redirect above
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-600">Manage your account information</p>
          </div>

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700"
            >
              {success}
            </motion.div>
          )}

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="card p-8 space-y-8"
          >
            {/* Avatar Section */}
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg mb-4"
              >
                <User size={48} />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-600 mt-1 capitalize">
                <Shield size={16} className="inline mr-1" />
                {user.role} Account
              </p>
            </div>

            {/* User Information */}
            <div className="border-t border-slate-200 pt-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Account Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                    <User size={16} className="inline mr-2 text-primary-600" />
                    {user.name}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email Address</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium break-all">
                    <Mail size={16} className="inline mr-2 text-primary-600" />
                    {user.email}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                    <Phone size={16} className="inline mr-2 text-primary-600" />
                    {user.phone}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Account Type</label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Join Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Member Since</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                    <Calendar size={16} className="inline mr-2 text-primary-600" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Verification Status</label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.isVerified ? '✓ Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="border-t border-slate-200 pt-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Account Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">Active Status:</span>{' '}
                    <span className={user.isActive ? 'text-green-600 font-bold' : 'text-red-600'}>
                      {user.isActive ? '✓ Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">User ID:</span>{' '}
                    <code className="text-xs bg-slate-200 px-2 py-1 rounded">
                      {user._id?.slice(-8)}...
                    </code>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-200 pt-8 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.role === 'driver' && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/search')}
                      fullWidth
                    >
                      🔍 Find Parking
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/bookings')}
                      fullWidth
                    >
                      📅 My Bookings
                    </Button>
                  </>
                )}

                {user.role === 'owner' && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/owner/parking')}
                      fullWidth
                    >
                      📍 Manage Parking
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/search/trending')}
                      fullWidth
                    >
                      🔥 Trending Spots
                    </Button>
                  </>
                )}

                <Button
                  variant="secondary"
                  onClick={() => navigate('/')}
                  fullWidth
                >
                  🏠 Go to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  fullWidth
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@parkme.com" className="text-primary-600 font-medium hover:underline">
                  support@parkme.com
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
