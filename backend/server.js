import profileRoutes from './routes/profile.js';
import authRoutes from './routes/auth.js';

import userRoutes from './routes/user.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();


// 🛡️ Global Security Middleware
app.use(helmet()); 
app.use(compression()); 

// 🚦 Rate Limiting (Prevent Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter limit for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
});

// 📝 Logging Setup
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
} else {
  app.use(morgan('combined'));
}

// 📦 Body Parsing & Cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 🌐 CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', // This matches your Register.jsx error port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 📂 Static Folder for local uploads (if not using Cloudinary for everything)
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 🛣️ API Routes

app.use('/api/auth', authLimiter, authRoutes); 
app.use('/api/profiles', profileRoutes);
app.use('/api/user', userRoutes);

// 🏥 Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// 🛠️ Professional Error Handler
app.use((err, req, res, next) => {
  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Handle Mongoose Duplicate Key Errors
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  console.error('❌ Error Details:', err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 🔍 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});