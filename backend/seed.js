import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Profile from './models/Profile.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");

    // Clear existing data to start fresh
    await User.deleteMany();
    await Profile.deleteMany();

    // 1. Create the User
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      age: 25
    });

    // 2. Create Profiles using the user._id
    await Profile.create([
      {
        user: user._id, // Fixes 'user path is required'
        profileName: 'Professional', // Fixes 'profileName is required'
        profileType: 'Work', 
        jobTitle: 'Software Engineer',
        company: 'Google'
      },
      {
        user: user._id,
        profileName: 'Casual',
        profileType: 'Personal',
        bio: 'MERN Stack Developer',
        hobbies: ['Coding', 'Music']
      }
    ]);

    console.log('✅ Database Seeded Successfully!');
    console.log('Login: test@example.com / password123');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
};

seedData();