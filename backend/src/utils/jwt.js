const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate JWT token for authenticated users
 * @param {string} userId - User ID to encode in token
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
