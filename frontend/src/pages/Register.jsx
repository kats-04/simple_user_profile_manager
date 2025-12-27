import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', age: '', password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure all fields required by Mongoose are present
      await axios.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-googleGray">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-googleBorder w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input 
            placeholder="First Name" 
            className="p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
            required 
          />
          <input 
            placeholder="Last Name" 
            className="p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
            required 
          />
        </div>
        <input 
          type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setFormData({...formData, email: e.target.value})} required 
        />
        <input 
          type="number" placeholder="Age" className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setFormData({...formData, age: e.target.value})} required 
        />
        <input 
          type="password" placeholder="Password" className="w-full p-3 border rounded-lg mb-6"
          onChange={(e) => setFormData({...formData, password: e.target.value})} required 
        />
        <button className="w-full bg-googleBlue text-white p-3 rounded-lg font-medium">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;