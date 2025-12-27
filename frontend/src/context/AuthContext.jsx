import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // FIXED: Axios Interceptor to send token automatically
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; //
      }
      return config;
    });

    return () => axios.interceptors.request.eject(requestInterceptor);
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('userInfo');
        const savedProfile = localStorage.getItem('activeProfile');

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedProfile) {
          setActiveProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error("Error parsing auth data", error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      
      // FIX: Ensure your backend sends 'accessToken' or 'token'
      const token = data.accessToken || data.token; 
      
      // Important: Add profiles to the user object so Selection screen works
      const userData = { ...data.user, profiles: data.profiles || [] };

      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      toast.success(`Welcome back!`);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const selectProfile = (profile) => {
    setActiveProfile(profile);
    localStorage.setItem('activeProfile', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    setActiveProfile(null);
    localStorage.clear();
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, activeProfile, login, selectProfile, logout, loading, setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
