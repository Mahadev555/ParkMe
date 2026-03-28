import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { Button, Input, Loader, Modal } from '../components'
import { useToastContext } from '../hooks/useToast.jsx'
import API from '../services/api'

/**
 * Payment Page
 * Process payment for booking
 */
const PaymentPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const toast = useToastContext()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  })

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/booking/${bookingId}`)
      setBooking(response.data.data)
    } catch (err) {
      const msg = 'Failed to load booking'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    try {
      setError('')
      setProcessing(true)

      // Validate card details
      if (!cardData.cardNumber || !cardData.cardholderName || !cardData.expiryDate || !cardData.cvv) {
        const msg = 'Please fill in all card details'
        setError(msg)
        toast.error(msg)
        setProcessing(false)
        return
      }

      const response = await API.post('/payment/pay', {
        bookingId,
        cardNumber: cardData.cardNumber,
        cardholderName: cardData.cardholderName,
        expiryDate: cardData.expiryDate,
        cvv: cardData.cvv,
      })

      toast.success('Payment successful! Your booking is confirmed.')
      setSuccess(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <Loader fullScreen />

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Booking not found</p>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Payment</h1>
            <p className="text-slate-600">Finalize your parking reservation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2 card p-6 space-y-6">
              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex gap-3"
                >
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Payment Failed</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <CreditCard size={24} />
                  <span>Card Details</span>
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({
                      ...cardData,
                      cardNumber: e.target.value.replace(/\D/g, '').substring(0, 16),
                    })}
                    maxLength="16"
                  />

                  <Input
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={cardData.cardholderName}
                    onChange={(e) => setCardData({
                      ...cardData,
                      cardholderName: e.target.value,
                    })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData({
                        ...cardData,
                        expiryDate: e.target.value,
                      })}
                      maxLength="5"
                    />

                    <Input
                      label="CVV"
                      placeholder="123"
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({
                        ...cardData,
                        cvv: e.target.value.replace(/\D/g, '').substring(0, 4),
                      })}
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>

              {/* Test Card Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Test Card Numbers</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>✅ Success: <code className="bg-white px-2 py-1 rounded">4532123456789010</code></p>
                  <p>❌ Declined: <code className="bg-white px-2 py-1 rounded">5555555555555555</code></p>
                </div>
              </div>

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                fullWidth
                size="lg"
                disabled={processing}
                loading={processing}
              >
                Pay ${booking.totalPrice}
              </Button>
            </div>

            {/* Order Summary */}
            <div className="card p-6 h-fit sticky top-20 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>

              <div className="space-y-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm text-slate-600">Location</p>
                  <p className="font-medium text-slate-900">{booking.parkingId?.title}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Check-in</p>
                  <p className="font-medium text-slate-900">
                    {new Date(booking.startTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Check-out</p>
                  <p className="font-medium text-slate-900">
                    {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Duration</p>
                  <p className="font-medium text-slate-900">
                    {Math.ceil((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60))} hours
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ${(booking.totalPrice * 0.9).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fees</span>
                  <span className="font-medium text-slate-900">
                    ${(booking.totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-2">
                  <span className="text-slate-900">Total</span>
                  <span className="text-primary-600">${booking.totalPrice}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600">
                  💳 Your payment is secure and encrypted. 🔒
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={success}
        onClose={() => navigate('/bookings')}
        closeButton={false}
      >
        <div className="text-center space-y-6 py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle size={64} className="mx-auto text-green-500" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
            <p className="text-slate-600">Your parking spot is reserved</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2 text-sm">
            <p><span className="font-medium">Booking ID:</span> {bookingId}</p>
            <p><span className="font-medium">Amount Paid:</span> ${booking.totalPrice}</p>
            <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Confirmed</span></p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg"
          >
            ✅ You will receive a confirmation email shortly with booking details and directions.
          </motion.div>

          <Button onClick={() => navigate('/bookings')} fullWidth size="lg">
            View My Bookings
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default PaymentPage
