import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, MapPin } from 'lucide-react'
import { ParkingCard, CardSkeleton } from '../components'
import { useToastContext } from '../hooks/useToast.jsx'
import API from '../services/api'

/**
 * Trending Parking Page
 * Show most popular/highly rated parking spaces
 */
const TrendingPage = () => {
  const navigate = useNavigate()
  const toast = useToastContext()
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      setLoading(true)
      const response = await API.get('/search/trending?limit=20')
      const results = response.data.data || []
      setParkings(results)
      if (results.length === 0) {
        toast.info('No trending parking yet')
      }
    } catch (err) {
      const msg = 'Failed to fetch trending parking'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleBook = (parkingId) => {
    navigate(`/parking/${parkingId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Flame size={40} className="text-orange-500" />
            </motion.div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Trending Now
            </h1>
          </div>
          <p className="text-slate-600 text-lg">The most popular and highly-rated parking spaces right now</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Stats */}
        {!loading && parkings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="card p-4 text-center">
              <p className="text-4xl font-bold text-primary-600 mb-1">{parkings.length}</p>
              <p className="text-slate-600">Popular Spots</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-4xl font-bold text-yellow-500 mb-1">⭐ 4.5</p>
              <p className="text-slate-600">Avg Rating</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-4xl font-bold text-green-600 mb-1">💰 5.99</p>
              <p className="text-slate-600">Avg Price/Hour</p>
            </div>
          </motion.div>
        )}

        {/* Parking Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : parkings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {parkings.map((parking, idx) => (
              <motion.div
                key={parking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
                {/* Trending Badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full px-3 py-1 text-sm font-bold flex items-center space-x-1 shadow-lg"
                >
                  <Flame size={14} />
                  <span>Trending</span>
                </motion.div>

                <ParkingCard
                  parking={parking}
                  onBook={() => handleBook(parking._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 card"
          >
            <MapPin size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 text-lg">No trending parking spaces at the moment</p>
          </motion.div>
        )}

        {/* Browse All Link */}
        {parkings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/search')}
              className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
            >
              View All Available Parking Spaces →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TrendingPage
