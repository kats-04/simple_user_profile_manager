import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const CreateProfile = () => {
  const [profileType, setProfileType] = useState('Personal');
  const { setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      // The Interceptor in AuthContext now handles the token
      // We just need to send the data object here
      const { data } = await axios.post('/profiles', { 
        profileType, 
        profileName: profileType 
      });

      // Update global user state with the new profile
      const updatedUser = { 
        ...user, 
        profiles: [...(user?.profiles || []), data.profile || data] 
      };
      
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      toast.success(`${profileType} profile created!`);
      navigate('/selection');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-6">
      <form onSubmit={handleCreate} className="max-w-md w-full bg-zinc-900 p-8 rounded-lg shadow-2xl border border-zinc-800">
        <h2 className="text-3xl font-semibold mb-6">Add Profile</h2>
        
        <div className="mb-8">
          <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wider">Select Profile Type</label>
          <select 
            className="w-full bg-zinc-800 p-4 rounded border border-zinc-700 focus:border-googleBlue outline-none"
            value={profileType}
            onChange={(e) => setProfileType(e.target.value)}
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-white text-black py-3 rounded font-bold hover:bg-gray-200 transition-colors">
            Save Profile
          </button>
          <button type="button" onClick={() => navigate('/selection')} className="flex-1 border border-zinc-600 py-3 rounded font-bold hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;