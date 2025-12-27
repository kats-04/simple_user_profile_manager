Simple User Profile Manager (MERN Stack):
A sophisticated, context-aware profile management application built with the MERN (MongoDB, Express, React, Node.js) stack.
This application allows users to maintain a single master account while switching between isolated Work and Personal profile
contexts, each with its own unique metadata.

 Key Features
Dual-Context Management: Seamlessly switch between "Work" and "Personal" modes. Changes made in one context do not affect the other.

JWT Authentication: Secure user sessions using JSON Web Tokens with persistent login state via LocalStorage.

Dynamic Dashboard: A responsive UI that adapts its layout and data display based on the active profile.

Full CRUD Functionality: Create, read, update, and manage multiple sub-profiles under one account.

Security Suite: Integrated password change functionality and protected API endpoints.


Shutterstock
🏗️ Technical Architecture
Backend
Node.js & Express: Handling the RESTful API and routing.

MongoDB & Mongoose: Document-based storage with relational-style linking between Users and Profiles.

Bcrypt.js: Industry-standard password hashing for user security.

Frontend
React (Vite): Optimized frontend delivery with fast refresh.

Context API: Global state management for handling the activeProfile and user data across the entire component tree.

Tailwind CSS: Utility-first styling for a clean, professional "Google-style" aesthetic.

Axios: Centralized API service with request interceptors for automatic token handling.

🚀 Getting Started
Prerequisites
Node.js (v16+)

MongoDB Atlas account or local MongoDB instance

Installation
Clone the repository

Bash

git clone https://github.com/kats-04/simple_user_profile_manager.git
cd simple_user_profile_manager
Backend Setup

Bash

cd backend
npm install
# Create a .env file and add:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
npm start
Frontend Setup

Bash

cd ../frontend
npm install
# Create a .env file and add:
# VITE_API_URL=http://localhost:5000/api
npm run dev
🔒 Security & Middleware
The application uses a custom protect middleware on the backend to verify JWT tokens in the Authorization header. This ensures that only the rightful owner can view or edit sensitive profile data.
