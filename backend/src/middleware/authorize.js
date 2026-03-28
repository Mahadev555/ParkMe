const ApiError = require('../utils/ApiError');

/**
 * Role-based Access Control Middleware
 * Restricts access based on user role
 * @param {...string} roles - Allowed roles
 * @returns {function} - Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = authorize;
