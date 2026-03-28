const Joi = require('joi');

/**
 * Validation Schemas using Joi
 * Centralized validation rules for request data
 */

const validationSchemas = {
  // Auth Validation
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string()
      .email()
      .lowercase()
      .required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid('driver', 'owner').required(),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),

  // Parking Validation
  createParking: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500),
    address: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    pricePerHour: Joi.number().min(0).required(),
    spacesAvailable: Joi.number().min(1).default(1),
    availability: Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().min(0).max(6).required(),
        startTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .required(),
        endTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .required(),
      })
    ),
  }),

  updateParking: Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    address: Joi.string(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    pricePerHour: Joi.number().min(0),
    spacesAvailable: Joi.number().min(1),
    isActive: Joi.boolean(),
    availability: Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().min(0).max(6).required(),
        startTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .required(),
        endTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .required(),
      })
    ),
  }),

  // Booking Validation
  createBooking: Joi.object({
    parkingId: Joi.string().required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date()
      .iso()
      .greater(Joi.ref('startTime'))
      .required(),
    notes: Joi.string().max(200).allow('', null).optional(),
  }),

  // Search Validation
  searchParking: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    radius: Joi.number().min(1).max(50000).default(5000), // meters
    maxPrice: Joi.number().min(0),
    minPrice: Joi.number().min(0),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10),
  }),
};

/**
 * Validation middleware factory
 * @param {string} schema - Name of the schema to validate against
 * @returns {function} - Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = validationSchemas[schema].validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
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

    // Attach validated data to request
    req.validated = value;
    next();
  };
};

module.exports = {
  validationSchemas,
  validate,
};
