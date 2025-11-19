const express = require('express');
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
  }
});

// Get featured events
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
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
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
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
