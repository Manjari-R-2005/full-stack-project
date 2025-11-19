const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendAnnouncementEmail } = require('../services/email');

const router = express.Router();

// Events - list all (any status)
router.get('/events', adminAuth, async (req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Events - create
router.post('/events', adminAuth, async (req, res) => {
  try {
    const ev = new Event(req.body);
    const saved = await ev.save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Events - update
router.put('/events/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updated = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Events - delete
router.delete('/events/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Users - list
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Users - bookings detail
router.get('/users/:id/bookings', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(id)
      .select('bookings')
      .populate({ path: 'bookings.eventId', select: 'title date time venue ticketTypes' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const bookings = (user.bookings || []).map((b) => ({
      eventId: b.eventId?._id || null,
      eventTitle: b.eventId?.title || '',
      date: b.eventId?.date || null,
      time: b.eventId?.time || '',
      venueName: b.eventId?.venue?.name || '',
      venueCity: b.eventId?.venue?.city || '',
      ticketType: b.ticketType,
      quantity: b.quantity,
      totalAmount: b.totalAmount,
      bookingDate: b.bookingDate,
    }));
    res.json({ bookings });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Users - update active status
router.patch('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updated = await User.findByIdAndUpdate(id, { isActive: !!isActive }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Analytics - totals
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const users = await User.find({}).select('bookings');
    const totalBookings = users.reduce((acc, u) => acc + (u.bookings?.length || 0), 0);
    const totalRevenue = users.reduce((acc, u) => acc + (u.bookings || []).reduce((a, b) => a + (b.totalAmount || 0), 0), 0);
    res.json({ totalUsers, totalBookings, totalRevenue });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Notifications - broadcast simple email announcement
router.post('/notify', adminAuth, async (req, res) => {
  try {
    const { subject = 'ConcertHub Announcement', message = '' } = req.body || {};
    const users = await User.find({ isActive: true }).select('email');

    let sent = 0;
    for (const u of users) {
      try {
        await sendAnnouncementEmail(u.email, subject, message);
        sent += 1;
      } catch (_) {}
    }
    res.json({ message: 'Broadcast queued', recipients: sent });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
