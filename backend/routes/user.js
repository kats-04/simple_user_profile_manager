import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes below
router.use(protect);

// @route   GET /api/user/me
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/user/update
router.put('/update', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { firstName, lastName, age } = req.body;
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    
    // FIX: Force age to be a Number so Mongoose doesn't reject it
    if (age) user.age = Number(age); 
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        age: user.age
      }
    });
  } catch (error) {
    // Return 400 so the frontend tells the user WHAT went wrong
    res.status(400).json({ message: error.message });
  }
});
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1. You MUST use .select('+password') to compare them
    const user = await User.findById(req.user._id).select('+password');
    
    // 2. This calls the bcrypt comparison in your User model
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // 3. Just assign and save; your model's 'pre-save' hook handles hashing
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;