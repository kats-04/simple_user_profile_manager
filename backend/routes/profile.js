import express from 'express';
// THIS IS THE CRITICAL FIX: The computer needs to know what 'Profile' is
import Profile from '../models/Profile.js'; 
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes in this file
router.use(protect);

// @route   POST /api/profiles
// @desc    Create a new profile card
router.post('/', async (req, res) => {
  try {
    const { profileName, profileType } = req.body;
    
    // We use the imported Profile model here
    const profile = await Profile.create({
      user: req.user._id, // Provided by the 'protect' middleware
      profileName: profileName || profileType,
      profileType: profileType // Must be 'Personal' or 'Work'
    });

    res.status(201).json(profile); // Send just the profile object
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/profiles
// @desc    Get all profiles for the logged-in user (Used for 'Who's watching?' screen)
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user._id }); //
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/profiles/:id
// @desc    Update a specific profile (Bio, Names, etc.)
router.put('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Ensure the logged-in user owns this profile
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields from the request body
    profile.firstName = req.body.firstName || profile.firstName;
    profile.lastName = req.body.lastName || profile.lastName;
    profile.bio = req.body.bio || profile.bio;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;