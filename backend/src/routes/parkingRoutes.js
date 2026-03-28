const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validate } = require('../utils/validation');
const {
  createParkingSpace,
  getOwnerParkingSpaces,
  getParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,
} = require('../controllers/parkingController');

const router = express.Router();

/**
 * Parking Routes
 */

// POST /api/v1/parking - Create parking space (owner only)
router.post(
  '/',
  auth,
  authorize('owner'),
  validate('createParking'),
  createParkingSpace
);

// GET /api/v1/parking/owner - Get owner's parking spaces
router.get(
  '/owner',
  auth,
  authorize('owner'),
  getOwnerParkingSpaces
);

// GET /api/v1/parking/:id - Get parking space by ID
router.get('/:id', getParkingSpace);

// PUT /api/v1/parking/:id - Update parking space (owner only)
router.put(
  '/:id',
  auth,
  authorize('owner'),
  validate('updateParking'),
  updateParkingSpace
);

// DELETE /api/v1/parking/:id - Delete parking space (owner only)
router.delete(
  '/:id',
  auth,
  authorize('owner'),
  deleteParkingSpace
);

module.exports = router;
