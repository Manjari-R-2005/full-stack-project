const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
<<<<<<< HEAD
    let token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token && req.header('authorization')) {
      token = req.header('authorization')?.replace('Bearer ', '');
    }
    if (!token && req.query?.token) {
      token = String(req.query.token);
    }
=======
    const token = req.header('Authorization')?.replace('Bearer ', '');
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

<<<<<<< HEAD
    if (user.isActive === false) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin required.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authorization failed' });
  }
};

module.exports = { auth, adminAuth };
