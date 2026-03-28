const { processPayment, getPaymentStatus } = require('../services/paymentService');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

/**
 * Payment Controller
 * Handles payment processing requests
 * Note: This is a mock implementation for demonstration
 */

/**
 * Process payment for a booking
 * POST /api/v1/payment/pay
 * Protected route
 *
 * Request body:
 * {
 *   "bookingId": "...",
 *   "cardNumber": "4532123456789010",
 *   "expiryDate": "12/25",
 *   "cvv": "123",
 *   "cardholderName": "John Doe"
 * }
 *
 * Mock card number 5555555555555555 will be rejected
 */
const makePayment = async (req, res, next) => {
  try {
    const { bookingId, cardNumber, expiryDate, cvv, cardholderName } = req.body;

    // Validate required fields
    if (!bookingId || !cardNumber || !expiryDate || !cvv || !cardholderName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details',
      });
    }

    const result = await processPayment(bookingId, req.user._id, {
      cardNumber,
      expiryDate,
      cvv,
      cardholderName,
    });

    res.status(200).json(
      new ApiResponse(200, result, 'Payment processed successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment status for a booking
 * GET /api/v1/payment/status/:bookingId
 * Protected route
 */
const checkPaymentStatus = async (req, res, next) => {
  try {
    const paymentStatus = await getPaymentStatus(req.params.bookingId, req.user._id);

    res.status(200).json(
      new ApiResponse(200, paymentStatus, 'Payment status retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  makePayment,
  checkPaymentStatus,
};
