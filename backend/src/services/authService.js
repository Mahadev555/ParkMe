const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Authentication Service
 * Handles user registration and login logic
 */

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {object} - User data with token
 * @throws {ApiError}
 */
const register = async (userData) => {
  try {
    const { name, email, phone, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      throw new ApiError(400, 'Email or phone already registered');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    // Remove password from response
    const userResponse = user.toJSON();

    // Generate token
    const token = generateToken(user._id);

    logger.info('User registered successfully', {
      userId: user._id,
      email: user.email,
    });

    return {
      user: userResponse,
      token,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Registration error', error.message);
    throw new ApiError(500, 'Registration failed');
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} - User data with token
 * @throws {ApiError}
 */
const login = async (email, password) => {
  try {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(403, 'User account is inactive');
    }

    // Remove password from response
    const userResponse = user.toJSON();

    // Generate token
    const token = generateToken(user._id);

    logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
    });

    return {
      user: userResponse,
      token,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Login error', error.message);
    throw new ApiError(500, 'Login failed');
  }
};

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {object} - User data
 * @throws {ApiError}
 */
const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user.toJSON();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Get profile error', error.message);
    throw new ApiError(500, 'Failed to fetch profile');
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
