const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Regular', 'VIP', 'Backstage Pass']
  },
  price: {
    type: Number,
    required: true
  },
  totalTickets: {
    type: Number,
    required: true
  },
  soldTickets: {
    type: Number,
    default: 0
  },
  remainingTickets: {
    type: Number,
    default: function() {
      return this.totalTickets - this.soldTickets;
    }
  }
});

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
  artist: {
    type: String,
    required: true
  },
  lineup: [{
    type: String
  }],
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
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
    city: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    }
  },
  poster: {
    type: String,
    required: true
  },
  ticketTypes: [ticketTypeSchema],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Virtual for remaining tickets across all types
eventSchema.virtual('totalRemainingTickets').get(function() {
  return this.ticketTypes.reduce((total, ticket) => {
    return total + (ticket.totalTickets - ticket.soldTickets);
  }, 0);
});

// Update remaining tickets before saving
eventSchema.pre('save', function(next) {
  this.ticketTypes.forEach(ticket => {
    ticket.remainingTickets = ticket.totalTickets - ticket.soldTickets;
  });
  next();
});

module.exports = mongoose.model('Event', eventSchema);
