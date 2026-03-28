import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Filter } from 'lucide-react'
import { Button, Input, ParkingCard, Loader, CardSkeleton } from '../components'
import { useAuth } from '../context/AuthContext'
import { useToastContext } from '../hooks/useToast.jsx'
import API from '../services/api'

/**
 * Search Page (Driver)
 * Find and filter parking spaces by location
 */
const SearchPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const toast = useToastContext()

  const [loading, setLoading] = useState(false)
  const [parkings, setParkings] = useState([])
  const [filters, setFilters] = useState({
    latitude: '',
    longitude: '',
    radius: 5000,
    minPrice: '',
    maxPrice: '',
  })

  const [error, setError] = useState('')

  // Redirect if not driver
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'driver') {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  /**
   * Get user's current location
   */
  const getLocation = () => {
    if (!navigator.geolocation) {
      const msg = 'Geolocation not supported by your browser'
      setError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        toast.info('Location detected! Searching nearby parking...')
        searchParking(position.coords.latitude, position.coords.longitude)
      },
      () => {
        const msg = 'Unable to get your location. Please enter manually.'
        setError(msg)
        toast.error(msg)
        setLoading(false)
      }
    )
  }

  /**
   * Search parking spaces
   */
  const searchParking = async (lat, lng) => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        latitude: lat || filters.latitude,
        longitude: lng || filters.longitude,
        radius: filters.radius,
      })

      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

      const response = await API.get(`/search?${params}`)
      const results = response.data.data.items || []
      setParkings(results)
      
      if (results.length === 0) {
        toast.info('No parking spaces found in your search area')
      } else {
        toast.success(`Found ${results.length} parking spaces!`)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to search parking'
      setError(msg)
      toast.error(msg)
      setParkings([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!filters.latitude || !filters.longitude) {
      const msg = 'Please enter location or enable geolocation'
      setError(msg)
      toast.error(msg)
      return
    }
    searchParking()
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Parking</h1>
          <p className="text-slate-600">Search for available parking spaces near you</p>
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

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8 space-y-4"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                name="latitude"
                placeholder="40.7128"
                value={filters.latitude}
                onChange={handleFilterChange}
                step="0.0001"
                icon={MapPin}
              />
              <Input
                label="Longitude"
                type="number"
                name="longitude"
                placeholder="-74.0060"
                value={filters.longitude}
                onChange={handleFilterChange}
                step="0.0001"
              />
            </div>

            {/* Price Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Radius (meters)
                </label>
                <select
                  name="radius"
                  value={filters.radius}
                  onChange={handleFilterChange}
                  className="input-primary"
                >
                  <option value={1000}>1 km</option>
                  <option value={5000}>5 km</option>
                  <option value={10000}>10 km</option>
                  <option value={50000}>50 km</option>
                </select>
              </div>

              <Input
                label="Min Price"
                type="number"
                name="minPrice"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                step="0.5"
              />

              <Input
                label="Max Price"
                type="number"
                name="maxPrice"
                placeholder="100"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                step="0.5"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                fullWidth
              >
                Search Parking
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={getLocation}
                disabled={loading}
              >
                📍 Use My Location
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : parkings.length > 0 ? (
          <>
            <p className="text-slate-600 mb-4">Found {parkings.length} parking spaces</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {parkings.map((parking) => (
                <ParkingCard
                  key={parking._id}
                  parking={parking}
                  distance={parking.distance}
                  onBook={() => handleBook(parking._id)}
                />
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-600 text-lg">
              {filters.latitude ? 'No parking spaces found in this area' : 'Enter location to search'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
