const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
<<<<<<< HEAD
const { body, validationResult } = require('express-validator');
const { sendOTPEmail, sendPasswordResetSuccess } = require('../services/email');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Forgot Password - request OTP
// shared handlers
async function handleForgot(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ message: 'If the email exists, an OTP has been sent' });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = code;
    user.resetOTPExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, code);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during forgot password' });
  }
}

async function handleVerifyOtp(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetOTP || !user.resetOTPExpires) return res.status(400).json({ message: 'Invalid or expired OTP' });
    if (user.resetOTP !== otp || user.resetOTPExpires < new Date()) return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
}

async function handleReset(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { email, otp, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.resetOTP !== otp || !user.resetOTPExpires || user.resetOTPExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = password;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    await sendPasswordResetSuccess(user.email);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
}

router.post('/forgot',
  body('email').isEmail().withMessage('Valid email is required'),
  handleForgot
);

// Verify OTP
router.post('/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 4 }).withMessage('OTP is required')
  ],
  handleVerifyOtp
);

// Reset Password
router.post('/reset',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  handleReset
);

// Alias routes to match requested paths
router.post('/forgot-password', body('email').isEmail().withMessage('Valid email is required'), handleForgot);
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], handleReset);

// Google login
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken is required' });
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = (payload.email || '').toLowerCase();
    const googleId = payload.sub;
    const displayName = payload.name || '';
    const avatarUrl = payload.picture || '';

    let user = await User.findOne({ email });
    if (!user) {
      const randomPwd = require('crypto').randomBytes(24).toString('hex');
      user = new User({
        name: displayName || email,
        displayName,
        email,
        password: randomPwd,
        role: email === 'manjari.raveendran@gmail.com' ? 'admin' : 'user',
        provider: 'google',
        googleId,
        avatarUrl,
        isVerified: true
      });
      await user.save();
    } else {
      // attach google fields if missing
      let changed = false;
      if (!user.googleId) { user.googleId = googleId; changed = true; }
      if (!user.provider || user.provider === 'local') { user.provider = 'google'; changed = true; }
      if (avatarUrl && user.avatarUrl !== avatarUrl) { user.avatarUrl = avatarUrl; changed = true; }
      if (displayName && user.displayName !== displayName) { user.displayName = displayName; changed = true; }
      if (email === 'manjari.raveendran@gmail.com' && user.role !== 'admin') { user.role = 'admin'; changed = true; }
      if (changed) await user.save();
    }

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ message: 'Invalid Google token' });
  }
});

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: email.toLowerCase() === 'manjari.raveendran@gmail.com' ? 'admin' : 'user'
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully. Please login to continue.',
=======

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({ 
      name, 
      email, 
      password, 
      phone,
      role: role || 'user'
    });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
<<<<<<< HEAD
=======
        phone: user.phone,
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
        role: user.role
      }
    });
  } catch (error) {
<<<<<<< HEAD
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
=======
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

<<<<<<< HEAD
=======
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
<<<<<<< HEAD
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
=======
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
<<<<<<< HEAD
=======
        phone: user.phone,
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
        role: user.role
      }
    });
  } catch (error) {
<<<<<<< HEAD
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        bookings: req.user.bookings
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/bookings
// @desc    Get current user's bookings with event details
// @access  Private
router.get('/bookings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('bookings')
      .populate({ path: 'bookings.eventId', select: 'title date time venue ticketTypes' });

    const bookings = (user?.bookings || []).map((b) => ({
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
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

=======
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
module.exports = router;
