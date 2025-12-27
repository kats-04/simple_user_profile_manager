import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify access token
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Generate Access & Refresh Tokens
export const generateTokens = (userId) => {
  // Use fallbacks ('1d', '7d') so the server never crashes on 'undefined'
  const accessToken = jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'fallback_secret_key', 
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
  
  const refreshToken = jwt.sign(
    { id: userId }, 
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_key', 
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
  
  return { accessToken, refreshToken };
};