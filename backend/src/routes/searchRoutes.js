const express = require('express');
const Joi = require('joi');
const { searchParkingSpaces, getTrendingParkingSpaces } = require('../controllers/searchController');

const router = express.Router();

/**
 * Query validation middleware for search
 */
const validateSearchQuery = (req, res, next) => {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    radius: Joi.number().min(1).max(50000).default(5000),
    maxPrice: Joi.number().min(0),
    minPrice: Joi.number().min(0),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10),
  });

  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
    convert: true, // Auto-convert string numbers to numbers
  });

  if (error) {
    const messages = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  req.validatedQuery = value;
  next();
};

/**
 * Search Routes
 */

// GET /api/v1/search - Search parking by location and filters
router.get('/', validateSearchQuery, searchParkingSpaces);

// GET /api/v1/search/trending - Get trending parking spaces
router.get('/trending', getTrendingParkingSpaces);

module.exports = router;
