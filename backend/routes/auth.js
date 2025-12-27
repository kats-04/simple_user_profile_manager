import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'; // Added missing jwt import for the refresh route
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { generateTokens } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user with default personal profile
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, age, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create user - Explicitly convert age to Number to avoid 400 Bad Request
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      age: Number(age), 
      password
    });
    
    // Create default personal profile
    // FIX: profileType changed to 'Personal' (Capital P) to match Mongoose enum
    await Profile.create({
      user: user._id,
      profileName: 'My Personal Profile',
      profileType: 'Personal', 
      isDefault: true
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    // Passes the error to the professional error handler in server.js
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    
    // Get user profiles to return upon login
    const profiles = await Profile.find({ user: user._id, isActive: true });
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        age: user.age
      },
      profiles,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user with refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    
    // Generate new tokens
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    
    res.json(tokens);
  } catch (error) {
    res.status(403).json({ message: 'Session expired. Please login again.' });
  }
});

// ... forgot-password and reset-password routes remain unchanged ...

export default router;