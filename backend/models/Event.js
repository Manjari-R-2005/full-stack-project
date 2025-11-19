const mongoose = require('mongoose');

<<<<<<< HEAD
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

=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
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
<<<<<<< HEAD
  artist: {
    type: String,
    required: true
  },
  lineup: [{
    type: String
  }],
=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  date: {
    type: Date,
    required: true
  },
<<<<<<< HEAD
  time: {
    type: String,
    required: true
  },
=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  venue: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
<<<<<<< HEAD
    city: {
      type: String,
      required: true
    },
=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    capacity: {
      type: Number,
      required: true
    }
  },
<<<<<<< HEAD
  poster: {
    type: String,
    required: true
  },
  ticketTypes: [ticketTypeSchema],
  featured: {
    type: Boolean,
    default: false
  },
=======
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
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
<<<<<<< HEAD
  genre: {
    type: String,
    required: true
=======
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Concert', 'Festival', 'Live Show', 'DJ Night'],
    default: 'Concert'
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  },
  duration: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

<<<<<<< HEAD
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
=======
// Virtual for total available tickets
eventSchema.virtual('totalAvailableTickets').get(function() {
  return this.ticketTypes.reduce((total, ticket) => total + ticket.available, 0);
});

// Virtual for total revenue potential
eventSchema.virtual('totalRevenuePotential').get(function() {
  return this.ticketTypes.reduce((total, ticket) => total + (ticket.price * ticket.total), 0);
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
});

module.exports = mongoose.model('Event', eventSchema);
