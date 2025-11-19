const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { auth, adminAuth } = require('../middleware/auth');
const QRCode = require('qrcode');

const router = express.Router();

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, ticketType, quantity, customerDetails } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is still upcoming
    if (event.status !== 'upcoming' || new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Event is not available for booking' });
    }

    // Find the ticket type
    const ticket = event.ticketTypes.find(t => t.type === ticketType);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket type not found' });
    }

    // Check availability
    if (ticket.available < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Calculate total price
    const totalPrice = ticket.price * quantity;

    // Set cancellation deadline (24 hours before event)
    const cancellationDeadline = new Date(new Date(event.date).getTime() - 24 * 60 * 60 * 1000);

    // Generate unique booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Generate QR code data
    const qrData = {
      bookingId,
      eventId,
      userId: req.user._id,
      ticketType,
      quantity,
      totalPrice,
      timestamp: new Date().toISOString()
    };

    // Generate QR code as base64 string
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      eventId,
      ticketType,
      quantity,
      totalPrice,
      customerDetails,
      cancellationDeadline,
      qrCode: qrCodeDataURL,
      bookingId
    });

    await booking.save();

    // Update ticket availability
    ticket.available -= quantity;
    await event.save();

    // Populate event details for response
    await booking.populate('eventId', 'title date venue');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('eventId', 'title date venue poster')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('eventId', 'title date venue poster artists')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('eventId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus !== 'confirmed') {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    if (new Date() > booking.cancellationDeadline) {
      return res.status(400).json({ message: 'Cancellation deadline has passed' });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Restore ticket availability
    const event = booking.eventId;
    const ticket = event.ticketTypes.find(t => t.type === booking.ticketType);
    if (ticket) {
      ticket.available += booking.quantity;
      await event.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, eventId } = req.query;
    const query = {};

    if (status) query.bookingStatus = status;
    if (eventId) query.eventId = eventId;

    const bookings = await Booking.find(query)
      .populate('eventId', 'title date venue')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (Admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus, paymentStatus },
      { new: true }
    ).populate('eventId', 'title date venue');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking statistics (Admin only)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'cancelled' });
    
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
