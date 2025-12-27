import React from 'react';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate('/selection'); // Send to "Who's watching?"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-googleGray">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-sm border border-googleBorder w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
        <input 
          type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-4"
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Password" className="w-full p-3 border rounded-lg mb-6"
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        <button className="w-full bg-googleBlue text-white p-3 rounded-lg font-medium mb-4">Login</button>
        <p className="text-center text-sm">
          Don't have an account? <Link to="/register" className="text-googleBlue">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;