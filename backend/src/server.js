require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const config = require('./config/env');
const logger = require('./utils/logger');

/**
 * Server Initialization
 * Starts the Express server and connects to MongoDB
 */

let server;

const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info('Attempting to connect to MongoDB...');
    await connectDB();
    logger.info('✅ Database connection successful');

    // Start Express server
    server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`API URL: http://localhost:${config.port}/api/${config.apiVersion}`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info('✅ ParkMe Backend is READY to accept requests');
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    logger.error('');
    logger.error('❌ FAILED TO START SERVER');
    logger.error(`Error: ${error.message}`);
    logger.error('');
    
    // Check if it's a MongoDB connection error
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      logger.error('🔴 DATABASE CONNECTION ERROR');
    } else {
      logger.error('Other error details:');
      logger.error(error.stack);
    }
    
    logger.error('');
    logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.error('Server startup aborted');
    
    process.exit(1);
  }
};

// ====== Graceful Shutdown ======
const handleShutdown = (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Force closing server');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason: reason.message || reason,
  });
  process.exit(1);
});

// Start server
startServer();

// ====== Database Connection Event Handlers ======
const mongoose = require('mongoose');

mongoose.connection.on('disconnected', () => {
  logger.error('❌ MongoDB disconnected unexpectedly');
  logger.error('Attempting to reconnect...');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB Connection Error (Runtime)', error.message);
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected successfully');
});
