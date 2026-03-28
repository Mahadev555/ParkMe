const {
  createParking,
  getParkingByOwner,
  getParkingById,
  updateParking,
  deleteParking,
} = require('../services/parkingService');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

/**
 * Parking Controller
 * Handles parking space management requests
 */

/**
 * Create a new parking space
 * POST /api/v1/parking
 * Protected route - owner role required
 */
const createParkingSpace = async (req, res, next) => {
  try {
    const { latitude, longitude, ...parkingData } = req.validated;

    const parking = await createParking(req.user._id, {
      ...parkingData,
      latitude,
      longitude,
    });

    res.status(201).json(
      new ApiResponse(201, parking, 'Parking space created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all parking spaces by owner
 * GET /api/v1/parking/owner
 * Protected route - owner role required
 */
const getOwnerParkingSpaces = async (req, res, next) => {
  try {
    const result = await getParkingByOwner(req.user._id, req.query);

    res.status(200).json(
      new ApiResponse(200, result, 'Parking spaces fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get parking space by ID
 * GET /api/v1/parking/:id
 */
const getParkingSpace = async (req, res, next) => {
  try {
    const parking = await getParkingById(req.params.id);

    res.status(200).json(
      new ApiResponse(200, parking, 'Parking space fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update parking space
 * PUT /api/v1/parking/:id
 * Protected route - owner of the space required
 */
const updateParkingSpace = async (req, res, next) => {
  try {
    const { latitude, longitude, ...updateData } = req.validated;

    const parking = await updateParking(req.params.id, req.user._id, {
      ...updateData,
      ...(latitude && longitude && { latitude, longitude }),
    });

    res.status(200).json(
      new ApiResponse(200, parking, 'Parking space updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete parking space
 * DELETE /api/v1/parking/:id
 * Protected route - owner of the space required
 */
const deleteParkingSpace = async (req, res, next) => {
  try {
    await deleteParking(req.params.id, req.user._id);

    res.status(200).json(
      new ApiResponse(200, null, 'Parking space deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createParkingSpace,
  getOwnerParkingSpaces,
  getParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,
};
