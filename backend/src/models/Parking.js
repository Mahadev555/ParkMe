const mongoose = require('mongoose');

/**
 * Parking Space Schema
 * Stores parking space details with geolocation support
 */
const parkingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function (v) {
            return (
              Array.isArray(v) &&
              v.length === 2 &&
              v[0] >= -180 &&
              v[0] <= 180 &&
              v[1] >= -90 &&
              v[1] <= 90
            );
          },
          message: 'Invalid coordinates. Must be [longitude, latitude]',
        },
      },
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Please provide hourly price'],
      min: [0, 'Price cannot be negative'],
    },
    availability: [
      {
        dayOfWeek: {
          type: Number,
          enum: [0, 1, 2, 3, 4, 5, 6], // 0 = Sunday, 6 = Saturday
          required: true,
        },
        startTime: {
          type: String,
          required: true, // Format: HH:MM
          match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format. Use HH:MM'],
        },
        endTime: {
          type: String,
          required: true, // Format: HH:MM
          match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format. Use HH:MM'],
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    spacesAvailable: {
      type: Number,
      default: 1,
      min: [1, 'At least one space must be available'],
    },
    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Create geospatial index for location queries
 * Enables efficient proximity searches
 */
parkingSchema.index({ 'location': '2dsphere' });
parkingSchema.index({ ownerId: 1 });
parkingSchema.index({ isActive: 1 });
parkingSchema.index({ pricePerHour: 1 });

module.exports = mongoose.model('Parking', parkingSchema);
