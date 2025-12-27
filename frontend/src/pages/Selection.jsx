import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Selection = () => {
  const { user, selectProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const getProfileStyles = (type) => {
    return type === 'Work' 
      ? 'bg-blue-600 group-hover:bg-blue-500' 
      : 'bg-emerald-600 group-hover:bg-emerald-500';
  };

  const handleProfileClick = (profile) => {
    selectProfile(profile);
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-5xl font-medium mb-12 animate-fade-in tracking-tight">Who's watching?</h1>
      
      <div className="flex flex-wrap justify-center gap-10">
        {/* Render existing profiles */}
        {user?.profiles?.map((profile) => (
          <div 
            key={profile._id} 
            onClick={() => handleProfileClick(profile)} 
            className="group cursor-pointer text-center"
          >
            <div className={`w-36 h-36 rounded-md flex items-center justify-center text-5xl font-bold border-4 border-transparent group-hover:border-white transition-all duration-300 transform group-hover:scale-105 shadow-2xl ${getProfileStyles(profile.profileType)}`}>
              {profile.profileType?.charAt(0) || 'P'}
            </div>
            <p className="mt-5 text-xl text-gray-400 group-hover:text-white transition-colors">
              {profile.profileType}
            </p>
          </div>
        ))}
        
        {/* The "Add Profile" Option */}
        {(!user?.profiles || user.profiles.length < 5) && (
          <div 
            onClick={() => navigate('/create-profile')} 
            className="group cursor-pointer text-center"
          >
            <div className="w-36 h-36 rounded-md flex items-center justify-center bg-zinc-800 group-hover:bg-zinc-700 transition-all duration-300 border-4 border-transparent group-hover:border-zinc-500">
              <PlusCircle size={60} className="text-zinc-500 group-hover:text-white" />
            </div>
            <p className="mt-5 text-xl text-gray-400 group-hover:text-white">Add Profile</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => navigate('/')}
        className="mt-20 px-8 py-2 border border-zinc-600 text-zinc-500 hover:text-white hover:border-white transition-all uppercase tracking-widest text-sm"
      >
        Manage Profiles
      </button>
    </div>
  );
};

export default Selection;