const express = require('express');
const Event = require('../models/Event');

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
router.patch('/:id/book-tickets', async (req, res) => {
  try {
    const { ticketType, quantity } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticketTypeObj = event.ticketTypes.find(t => t.type === ticketType);
    
    if (!ticketTypeObj) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }

    if (ticketTypeObj.remainingTickets < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    ticketTypeObj.soldTickets += quantity;
    await event.save();

    res.json({ 
      message: 'Tickets booked successfully',
      remainingTickets: ticketTypeObj.remainingTickets
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
