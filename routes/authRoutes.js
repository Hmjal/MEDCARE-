const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'medcare_jwt_secret_2026';

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    gender: user.gender,
    dob: user.dob,
    memberSince: user.memberSince,
    walletBalance: user.walletBalance,
    medcareCoins: user.medcareCoins,
    cart: user.cart || [],
    wishlist: user.wishlist || [],
    addresses: user.addresses || []
  };
}

// 1. POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, gender, dob } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, and password are required.'
      });
    }
    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: String(password), // Hashed via pre-save hook
      role: 'customer',
      gender: gender || 'Not Specified',
      dob: dob || '',
      walletBalance: 100,
      medcareCoins: 200
    });

    user.password = undefined;
    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    next(err);
  }
});

// 2. POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, identifier, password } = req.body;
    const loginId = (email || identifier || '').trim();

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const query = loginId.includes('@')
      ? { email: loginId.toLowerCase() }
      : { phone: loginId };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    user.password = undefined;
    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    next(err);
  }
});

// 3. GET /api/auth/me (Protected Route)
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (err) {
    next(err);
  }
});

// 4. PUT /api/auth/profile (Protected Route)
router.put('/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const { name, phone, dob, gender, avatar, addresses } = req.body;
    if (name !== undefined) user.name = String(name).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (dob !== undefined) user.dob = dob;
    if (gender !== undefined) user.gender = gender;
    if (avatar !== undefined) user.avatar = avatar;
    if (Array.isArray(addresses)) user.addresses = addresses;

    await user.save();
    user.password = undefined;

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitizeUser(user)
    });
  } catch (err) {
    next(err);
  }
});

// 5. POST /api/auth/admin-seed (Initialize default Admin account if none exists)
router.post('/admin-seed', async (req, res, next) => {
  try {
    let admin = await User.findOne({ email: 'admin@medcare.com' });
    if (admin) {
      return res.json({
        success: true,
        message: 'Admin account already exists.',
        user: sanitizeUser(admin)
      });
    }

    admin = await User.create({
      name: 'MedCare Chief Admin',
      email: 'admin@medcare.com',
      phone: '9800000001',
      password: 'AdminPassword123!',
      role: 'admin'
    });
    admin.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Default Admin account initialized.',
      user: sanitizeUser(admin)
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
