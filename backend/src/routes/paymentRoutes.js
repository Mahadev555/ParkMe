const express = require('express');
const auth = require('../middleware/auth');
const { makePayment, checkPaymentStatus } = require('../controllers/paymentController');

const router = express.Router();

/**
 * Payment Routes
 */

// POST /api/v1/payment/pay - Process payment for booking
router.post(
  '/pay',
  auth,
  makePayment
);

// GET /api/v1/payment/status/:bookingId - Get payment status
router.get(
  '/status/:bookingId',
  auth,
  checkPaymentStatus
);

module.exports = router;
