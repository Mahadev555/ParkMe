import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, ArrowLeft, Star } from 'lucide-react'
import { Button, Loader, Modal } from '../components'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

/**
 * Parking Details Page
 * View full parking info and book a slot
 */
const ParkingDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [parking, setParking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    startTime: '',
    endTime: '',
    notes: '',
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchParking()
  }, [id])

  const fetchParking = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/parking/${id}`)
      setParking(response.data.data)
    } catch (err) {
      setError('Failed to load parking details')
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = () => {
    if (!bookingData.startTime || !bookingData.endTime || !parking) return 0
    const start = new Date(bookingData.startTime)
    const end = new Date(bookingData.endTime)
    const hours = Math.ceil((end - start) / (1000 * 60 * 60))
    return (hours * parking.pricePerHour).toFixed(2)
  }

  const handleBooking = async () => {
    try {
      setBookingLoading(true)
      const response = await API.post('/booking', {
        parkingId: id,
        startTime: new Date(bookingData.startTime).toISOString(),
        endTime: new Date(bookingData.endTime).toISOString(),
        notes: bookingData.notes,
      })

      // Navigate to payment
      navigate(`/booking/${response.data.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <Loader fullScreen />

  if (!parking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Parking not found</p>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/search')}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Search</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="card h-96 bg-gradient-to-br from-primary-400 to-secondary-400 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-pattern" />
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{parking.rating || 0}</span>
              </div>
            </div>

            {/* Info */}
            <div className="card p-6 space-y-4">
              <h1 className="text-4xl font-bold text-slate-900">{parking.title}</h1>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-slate-600">Address</p>
                    <p className="font-medium text-slate-900">{parking.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DollarSign className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-slate-600">Price Per Hour</p>
                    <p className="font-medium text-slate-900">${parking.pricePerHour}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-slate-600">Availability</p>
                    <p className="font-medium text-slate-900">
                      {parking.spacesAvailable} spaces available
                    </p>
                  </div>
                </div>
              </div>

              {parking.description && (
                <>
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600">{parking.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="card p-6 h-fit sticky top-20 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Book This Space</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    startTime: e.target.value,
                  }))}
                  className="input-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    endTime: e.target.value,
                  }))}
                  min={bookingData.startTime}
                  className="input-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    notes: e.target.value,
                  }))}
                  placeholder="Any special requests..."
                  rows="3"
                  className="input-primary resize-none"
                />
              </div>
            </div>

            {/* Price Summary */}
            {bookingData.startTime && bookingData.endTime && (
              <div className="bg-primary-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Hours:</span>
                  <span className="font-bold text-slate-900">
                    {Math.ceil((new Date(bookingData.endTime) - new Date(bookingData.startTime)) / (1000 * 60 * 60))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-primary-200 pt-2">
                  <span className="font-bold text-slate-900">Total Price:</span>
                  <span className="text-2xl font-bold text-primary-600">${calculatePrice()}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              onClick={() => setShowBookingModal(true)}
              disabled={!bookingData.startTime || !bookingData.endTime}
              loading={bookingLoading}
            >
              Confirm & Pay
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Booking"
      >
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-slate-900">Booking Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Location:</span>
                <span className="font-medium">{parking.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date & Time:</span>
                <span className="font-medium">
                  {new Date(bookingData.startTime).toLocaleString()} - {new Date(bookingData.endTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-primary-600">${calculatePrice()}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            By clicking "Continue", you agree to the booking terms and will be redirected to payment.
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowBookingModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              fullWidth
              loading={bookingLoading}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ParkingDetailsPage
