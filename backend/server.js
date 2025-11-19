const path = require('path');
const dotenv = require('dotenv');
// Load env FIRST
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Now safe to import modules that may use env
const { verifyTransporter } = require('./services/email');
// Import routes after env is loaded
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Concert Events Management System API' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/concert-events';

// Verify SMTP transporter once on startup (non-blocking)
verifyTransporter && verifyTransporter();

async function connectWithRetry(retries = 30, delayMs = 2000) {
  let attempt = 0;
  while (true) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
      return;
    } catch (error) {
      attempt += 1;
      console.error('MongoDB connection error:', error?.message || error);
      if (attempt >= retries) {
        attempt = 0; // keep retrying indefinitely after initial attempts
        console.error('Retrying MongoDB connection...');
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

connectWithRetry();

module.exports = app;
