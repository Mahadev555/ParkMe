import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, DollarSign, X, Eye } from 'lucide-react'
import { Button, CardSkeleton, Modal } from '../components'
import { useToastContext } from '../hooks/useToast.jsx'
import API from '../services/api'

/**
 * My Bookings Page (Driver)
 * View all bookings and their status
 */
const MyBookingsPage = () => {
  const navigate = useNavigate()
  const toast = useToastContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await API.get('/booking/my-bookings?page=1&limit=20')
      const results = response.data.data.items || []
      setBookings(results)
      if (results.length === 0) {
        toast.info('You have no bookings yet')
      }
    } catch (err) {
      const msg = 'Failed to fetch bookings'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      setCancelLoading(true)
      await API.delete(`/booking/${bookingId}`)
      toast.success('Booking cancelled successfully!')
      fetchBookings()
      setShowModal(false)
    } catch (err) {
      const msg = 'Failed to cancel booking'
      setError(msg)
      toast.error(msg)
    } finally {
      setCancelLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-600">View and manage your parking reservations</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-lg shimmer" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card p-6 hover:shadow-lg transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* Parking Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900">
                      {booking.parkingId?.title || 'Parking Space'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin size={16} />
                      <span>{booking.parkingId?.address || 'Address'}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-medium">BOOKING DATES</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar size={16} className="text-primary-600" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {new Date(booking.startTime).toLocaleDateString()}
                        </p>
                        <p className="text-slate-600">
                          {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {' '}
                          {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-medium">TOTAL PRICE</p>
                    <div className="flex items-center space-x-1">
                      <DollarSign size={20} className="text-green-600" />
                      <span className="text-2xl font-bold text-slate-900">
                        {booking.totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status?.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus?.toUpperCase()}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowModal(true)
                      }}
                      fullWidth
                    >
                      <Eye size={16} className="mr-1" /> View Details
                    </Button>
                  </div>
                </div>

                {booking.notes && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">Notes:</span> {booking.notes}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 card p-8"
          >
            <Calendar size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 text-lg mb-4">No bookings yet</p>
            <Button onClick={() => navigate('/search')}>Search for Parking</Button>
          </motion.div>
        )}
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedBooking(null)
        }}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Parking Info */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">
                {selectedBooking.parkingId?.title}
              </h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>📍 {selectedBooking.parkingId?.address}</p>
                <p>💰 ${selectedBooking.parkingId?.pricePerHour}/hour</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Check-In</p>
                <p className="font-medium text-slate-900">
                  {new Date(selectedBooking.startTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Check-Out</p>
                <p className="font-medium text-slate-900">
                  {new Date(selectedBooking.endTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Booking Status</p>
                <p className={`${getStatusColor(selectedBooking.status)} px-2 py-1 rounded text-xs font-medium w-fit`}>
                  {selectedBooking.status?.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Payment Status</p>
                <p className={`${getPaymentStatusColor(selectedBooking.paymentStatus)} px-2 py-1 rounded text-xs font-medium w-fit`}>
                  {selectedBooking.paymentStatus?.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Duration:</span>
                <span className="font-medium text-slate-900">
                  {Math.ceil((new Date(selectedBooking.endTime) - new Date(selectedBooking.startTime)) / (1000 * 60 * 60))} hours
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-bold text-slate-900">Total Price:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${selectedBooking.totalPrice}
                </span>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Notes:</span> {selectedBooking.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false)
                  setSelectedBooking(null)
                }}
                fullWidth
              >
                Close
              </Button>
              {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                <Button
                  variant="outline"
                  onClick={() => handleCancel(selectedBooking._id)}
                  disabled={cancelLoading}
                  loading={cancelLoading}
                  fullWidth
                >
                  <X size={16} className="mr-1" /> Cancel Booking
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MyBookingsPage
