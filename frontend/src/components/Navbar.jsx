import React from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Repeat, Settings } from 'lucide-react';

const Navbar = () => {
  const { activeProfile, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Color matching logic
  const getAvatarColor = (type) => {
    return type === 'Work' ? 'bg-blue-600' : 'bg-emerald-600';
  };

  return (
    <nav className="h-16 bg-white border-b border-googleBorder flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold text-googleBlue tracking-tight">MERN Manager</span>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200">
          {activeProfile?.profileType} Mode
        </span>
      </div>
      
      <div className="relative">
        {/* Profile Shortcut Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-googleBorder"
        >
          {/* Initial-based Avatar Circle */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${getAvatarColor(activeProfile?.profileType)}`}>
            {activeProfile?.profileType?.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {activeProfile?.profileType}
          </span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-56 bg-white border border-googleBorder rounded-xl shadow-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-gray-100 mb-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Active Context</p>
                <p className="text-sm font-semibold text-gray-800 uppercase">{activeProfile?.profileType} Workspace</p>
              </div>
              
              <button 
                onClick={() => { navigate('/selection'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Repeat size={16} className="text-gray-400" /> Switch Profile
              </button>

              <button 
                onClick={() => { navigate('/edit-profile'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} className="text-gray-400" /> Profile Settings
              </button>
              
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;