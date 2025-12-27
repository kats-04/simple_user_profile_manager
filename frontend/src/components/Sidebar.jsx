
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Shield, LogOut, LayoutGrid } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 p-3 rounded-r-full transition-all ${
      isActive ? 'bg-blue-50 text-googleBlue font-medium' : 'hover:bg-gray-100 text-gray-600'
    }`;

  return (
    <div className="w-64 bg-white border-r border-googleBorder flex flex-col pt-10">
      <nav className="flex-1 space-y-1 pr-4">
        <NavLink to="/dashboard" className={linkClass}><LayoutGrid size={20}/> Dashboard</NavLink>
        <NavLink to="/edit-profile" className={linkClass}><User size={20}/> Edit Profile</NavLink>
        <NavLink to="/security" className={linkClass}><Shield size={20}/> Security</NavLink>
      </nav>
      <div className="p-4 border-t">
        <button onClick={logout} className="flex items-center gap-3 p-3 text-red-500 w-full hover:bg-red-50 rounded-lg">
          <LogOut size={20}/> Sign Out
        </button>
      </div>
    </div>
  );
};
export default Sidebar;