const mongoose = require('mongoose');

/**
 * Booking Schema
 * Tracks parking space reservations by drivers
 */
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parking',
      required: [true, 'Parking ID is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function (v) {
          return v > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'booked', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentId: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Calculate total hours and price when creating booking
 */
bookingSchema.methods.calculateDuration = function () {
  const durationHours = (this.endTime - this.startTime) / (1000 * 60 * 60);
  return Math.ceil(durationHours);
};

/**
 * Populate owner details before returning booking
 */
bookingSchema.pre(/^find/, function () {
  this.populate({
    path: 'userId',
    select: 'name email phone',
  }).populate({
    path: 'parkingId',
    select: 'title address pricePerHour',
  });
});

// Indexes for faster queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ parkingId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
