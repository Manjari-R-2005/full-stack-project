const express = require('express');
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
  }
});

// Get featured events
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
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
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
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
