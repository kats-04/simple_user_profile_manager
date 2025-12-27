import jwt from 'jsonwebtoken';

export const generateTokens = (id) => {
  // Use a fallback value if your .env variable is missing or empty
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d', // Ensure this is a string like '1d'
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d', // Ensure this is a string like '7d'
  });

  return { accessToken, refreshToken };
};