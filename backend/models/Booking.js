const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ticketType: {
    type: String,
    required: true,
    enum: ['Regular', 'VIP', 'Backstage Pass']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  customerDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'attended'],
    default: 'confirmed'
  },
  qrCode: {
    type: String,
    default: ''
  },
  seatNumbers: [String],
  bookingDate: {
    type: Date,
    default: Date.now
  },
  cancellationDeadline: {
    type: Date
  }
}, {
  timestamps: true
});

// Note: bookingId is now generated in the booking route

// Virtual for checking if booking can be cancelled
bookingSchema.virtual('canCancel').get(function() {
  return this.cancellationDeadline && new Date() < this.cancellationDeadline && this.bookingStatus === 'confirmed';
});

module.exports = mongoose.model('Booking', bookingSchema);
