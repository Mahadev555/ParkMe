require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const aiRoutes = require('./routes/ai.routes');

/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */
const app = express();

// ====== Security Middleware ======
app.use(helmet()); // Set security HTTP headers
pp.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://parkmeai.netlify.app',
  credentials: true,
}));

// ====== Body Parser Middleware ======
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// ====== Request Logging ======
app.use(requestLogger);

// ====== API Routes ======
const apiVersion = `/api/${config.apiVersion}`;

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ParkMe API',
    version: config.apiVersion,
    endpoints: {
      auth: `${apiVersion}/auth`,
      parking: `${apiVersion}/parking`,
      search: `${apiVersion}/search`,
      booking: `${apiVersion}/booking`,
      payment: `${apiVersion}/payment`,
      ai: `${apiVersion}/ai`,
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use(`${apiVersion}/auth`, authRoutes);

// Parking routes
app.use(`${apiVersion}/parking`, parkingRoutes);

// Search routes
app.use(`${apiVersion}/search`, searchRoutes);

// Booking routes
app.use(`${apiVersion}/booking`, bookingRoutes);

// Payment routes
app.use(`${apiVersion}/payment`, paymentRoutes);

// AI routes
app.use(`${apiVersion}/ai`, aiRoutes);

// ====== 404 Handler ======
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

// ====== Global Error Handler ======
app.use(errorHandler);

module.exports = app;
