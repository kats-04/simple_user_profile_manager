import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Import your pages
import Login from './pages/Login';
import Register from './pages/Register';
import Selection from './pages/Selection';
import CreateProfile from './pages/CreateProfile';
import Dashboard from './pages/Dashboard';
import Security from './pages/Security';
import EditProfile from './pages/EditProfile';

// Protected Route: Requires Login
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Show spinner while checking localStorage session
  if (loading) return <LoadingSpinner />;
  
  return user ? children : <Navigate to="/" />;
};

// Profile Route: Requires Active Profile
const ProfileRoute = ({ children }) => {
  const { activeProfile, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;

  // Kick back to selection if no profile is active
  return activeProfile ? children : <Navigate to="/selection" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Step 1: Pick or Create a Profile */}
          <Route path="/selection" element={
            <PrivateRoute>
              <Selection />
            </PrivateRoute>
          } />

          <Route path="/create-profile" element={
            <PrivateRoute>
              <CreateProfile />
            </PrivateRoute>
          } />

          {/* Step 2: Access the Dashboard & Management */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <ProfileRoute>
                <Dashboard />
              </ProfileRoute>
            </PrivateRoute>
          } />
          
          <Route path="/edit-profile" element={
            <PrivateRoute>
              <ProfileRoute>
                <EditProfile />
              </ProfileRoute>
            </PrivateRoute>
          } />

          <Route path="/security" element={
            <PrivateRoute>
              <ProfileRoute>
                <div className="flex bg-googleGray min-h-screen">
                   {/* Security logic remains inside the component */}
                  <Security />
                </div>
              </ProfileRoute>
            </PrivateRoute>
          } />

          {/* Catch-all: Redirect to Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;