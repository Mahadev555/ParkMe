const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed`);
    console.error(`   Error: ${error.message}`);
    console.error(`   URI: ${process.env.MONGODB_URI}`);
    
    // Provide helpful error context
    if (error.code === 'ECONNREFUSED') {
      console.error(`\n   💡 Connection Refused - MongoDB is not running`);
    } else if (error.name === 'MongoParseError') {
      console.error(`\n   💡 Invalid Connection String - Check MONGODB_URI in .env`);
    } else if (error.name === 'MongoServerSelectionError') {
      console.error(`\n   💡 Cannot reach MongoDB server - Check if service is running`);
    }
    
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error(`❌ MongoDB Disconnection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
