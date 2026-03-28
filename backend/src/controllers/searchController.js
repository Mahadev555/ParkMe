const { searchParking, getTrendingParking } = require('../services/searchService');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

/**
 * Search Controller
 * Handles parking space search requests
 */

/**
 * Search parking spaces by location and filters
 * GET /api/v1/search
 * Accessible to drivers
 */
const searchParkingSpaces = async (req, res, next) => {
  try {
    const {
      latitude,
      longitude,
      radius = 5000,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.validatedQuery;

    const result = await searchParking({
      latitude,
      longitude,
      radius,
      minPrice,
      maxPrice,
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(200, result, 'Parking spaces retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get trending parking spaces
 * GET /api/v1/search/trending
 */
const getTrendingParkingSpaces = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const parkings = await getTrendingParking(limit);

    res.status(200).json(
      new ApiResponse(200, parkings, 'Trending parking spaces retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchParkingSpaces,
  getTrendingParkingSpaces,
};
