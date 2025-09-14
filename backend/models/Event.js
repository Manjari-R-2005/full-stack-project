const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    }
  },
  artists: [{
    name: {
      type: String,
      required: true
    },
    genre: String,
    image: String
  }],
  ticketTypes: [{
    type: {
      type: String,
      required: true,
      enum: ['Regular', 'VIP', 'Backstage Pass']
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    features: [String]
  }],
  poster: {
    type: String,
    default: ''
  },
  images: [String],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Concert', 'Festival', 'Live Show', 'DJ Night'],
    default: 'Concert'
  },
  duration: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Virtual for total available tickets
eventSchema.virtual('totalAvailableTickets').get(function() {
  return this.ticketTypes.reduce((total, ticket) => total + ticket.available, 0);
});

// Virtual for total revenue potential
eventSchema.virtual('totalRevenuePotential').get(function() {
  return this.ticketTypes.reduce((total, ticket) => total + (ticket.price * ticket.total), 0);
});

module.exports = mongoose.model('Event', eventSchema);
