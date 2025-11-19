const express = require('express');
<<<<<<< HEAD
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendBookingConfirmation } = require('../services/email');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'upcoming' })
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
=======
const Event = require('../models/Event');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all events with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'upcoming', 
      category, 
      featured,
      search 
    } = req.query;

    const query = {};
    
    // Filter by status
    if (status !== 'all') {
      query.status = status;
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'artists.name': { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  }
});

// Get featured events
<<<<<<< HEAD
router.get('/featured', async (req, res) => {
  try {
    const featuredEvents = await Event.find({ 
      featured: true, 
      status: 'upcoming' 
    }).sort({ date: 1 });
    res.json(featuredEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }
=======
router.get('/featured/list', async (req, res) => {
  try {
    const events = await Event.find({ 
      featured: true, 
      status: 'upcoming',
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(6);
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ message: error.message });
  }
});

// Create new event (for admin use)
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update ticket sales
router.patch('/:id/book-tickets', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }
    const { ticketType, quantity, email } = req.body;
=======
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create event (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      // Set cancellation deadline to 24 hours before event
      cancellationDeadline: new Date(new Date(req.body.date).getTime() - 24 * 60 * 60 * 1000)
    };
    
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update event (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update ticket availability
router.patch('/:id/tickets', async (req, res) => {
  try {
    const { ticketType, quantity } = req.body;
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
<<<<<<< HEAD

    const ticketTypeObj = event.ticketTypes.find(t => t.type === ticketType);
    
    if (!ticketTypeObj) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }

    const sold = Number(ticketTypeObj.soldTickets || 0);
    const totalTickets = Number(ticketTypeObj.totalTickets);
    const fallbackRemaining = Number(ticketTypeObj.remainingTickets);
    const remaining = Number.isFinite(totalTickets)
      ? Math.max(0, totalTickets - sold)
      : (Number.isFinite(fallbackRemaining) ? fallbackRemaining : Infinity);

    if (remaining < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    ticketTypeObj.soldTickets += quantity;
    event.markModified('ticketTypes');
    await event.save({ validateBeforeSave: false });

    // Compute total
    const unitPrice = Number(ticketTypeObj.price || 0);
    const total = unitPrice * Number(quantity);

    // Persist booking on the authenticated user account
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.bookings.push({
          eventId: event._id,
          ticketType,
          quantity,
          totalAmount: total,
          bookingDate: new Date()
        });
        await user.save();
      }
    } catch (e) {
      console.error('User booking record failed (non-fatal):', e?.message || e);
    }

    // Optional: send confirmation email if email provided
    if (email || req.user?.email) {
      try {
        await sendBookingConfirmation(email || req.user.email, {
          bookingId: `BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          eventTitle: event.title,
          date: new Date(event.date).toLocaleDateString('en-US'),
          time: event.time,
          venue: event.venue?.name || '',
          city: event.venue?.city || '',
          ticketType,
          quantity,
          total: (ticketTypeObj.price * quantity).toFixed(2),
        });
      } catch (e) {
        // non-fatal
        console.error('Email send failed:', e?.message || e);
      }
    }

    res.json({ 
      message: 'Tickets booked successfully',
      remainingTickets: Number.isFinite(totalTickets)
        ? Math.max(0, (totalTickets - (sold + quantity)))
        : (Number.isFinite(fallbackRemaining) ? Math.max(0, fallbackRemaining - quantity) : null),
      booking: {
        eventId: event._id,
        eventTitle: event.title,
        date: event.date,
        time: event.time,
        venueName: event.venue?.name || '',
        venueCity: event.venue?.city || '',
        ticketType,
        quantity,
        totalAmount: total,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Explicit notify route (if front-end prefers separate call)
router.post('/:id/notify', async (req, res) => {
  try {
    const { email, booking } = req.body;
    if (!email || !booking) return res.status(400).json({ message: 'Missing email or booking' });
    await sendBookingConfirmation(email, booking);
    res.json({ message: 'Notification sent' });
=======
    
    const ticket = event.ticketTypes.find(t => t.type === ticketType);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket type not found' });
    }
    
    if (ticket.available < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }
    
    ticket.available -= quantity;
    await event.save();
    
    res.json(event);
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
