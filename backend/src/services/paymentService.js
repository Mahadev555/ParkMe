const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Payment Service
 * Handles mock payment processing
 */

/**
 * Process payment for a booking
 * This is a mock payment function for demonstration
 * In production, integrate with real payment gateway (Stripe, PayPal, etc.)
 *
 * @param {string} bookingId - Booking ID
 * @param {string} userId - User ID (for authorization)
 * @param {object} paymentData - Payment information
 * @returns {object} - Payment result
 * @throws {ApiError}
 */
const processPayment = async (bookingId, userId, paymentData) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Handle both populated and non-populated userId
    const bookingUserIdStr = booking.userId._id 
      ? booking.userId._id.toString() 
      : booking.userId.toString();
    const requestUserIdStr = userId.toString();

    if (bookingUserIdStr !== requestUserIdStr) {
      throw new ApiError(403, 'Not authorized to pay for this booking');
    }

    if (booking.paymentStatus === 'paid') {
      throw new ApiError(400, 'This booking is already paid');
    }

    // Mock payment processing
    const { cardNumber, expiryDate, cvv, cardholderName } = paymentData;

    // Validate card details (basic validation)
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      throw new ApiError(400, 'Missing card details');
    }

    // Simple validation: reject if card number contains '5555' (mock reject)
    if (cardNumber.includes('5555')) {
      logger.warn('Payment declined - Mock rejected card', {
        bookingId,
        userId,
      });

      throw new ApiError(402, 'Payment declined. Please try with a different card.');
    }

    // Generate mock payment ID
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update booking with payment info
    booking.paymentStatus = 'paid';
    booking.paymentId = paymentId;
    booking.status = 'booked';
    await booking.save();

    logger.info('Payment processed successfully', {
      bookingId,
      userId,
      paymentId,
      amount: booking.totalPrice,
    });

    return {
      success: true,
      message: 'Payment processed successfully',
      paymentId,
      booking,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Payment processing error', error.message);
    throw new ApiError(500, 'Payment processing failed');
  }
};

/**
 * Get payment status for a booking
 * @param {string} bookingId - Booking ID
 * @param {string} userId - User ID (for authorization)
 * @returns {object} - Payment status
 * @throws {ApiError}
 */
const getPaymentStatus = async (bookingId, userId) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.userId.toString() !== userId) {
      throw new ApiError(403, 'Not authorized to view this booking');
    }

    return {
      bookingId: booking._id,
      amount: booking.totalPrice,
      status: booking.paymentStatus,
      paymentId: booking.paymentId,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Get payment status error', error.message);
    throw new ApiError(500, 'Failed to fetch payment status');
  }
};

module.exports = {
  processPayment,
  getPaymentStatus,
};
