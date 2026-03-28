const { register, login, getProfile } = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

/**
 * Authentication Controller
 * Handles authentication-related requests
 */

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.validated;

    const result = await register({
      name,
      email,
      phone,
      password,
      role,
    });

    res.status(201).json(
      new ApiResponse(201, result, 'User registered successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    const result = await login(email, password);

    res.status(200).json(
      new ApiResponse(200, result, 'Login successful')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile
 * GET /api/v1/auth/profile
 * Protected route - requires authentication
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await getProfile(req.user._id);

    res.status(200).json(
      new ApiResponse(200, user, 'Profile fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
