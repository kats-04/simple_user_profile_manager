import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldCheck, Lock, Eye, KeyRound } from 'lucide-react';

const Security = () => {
  const { user, activeProfile, logout } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      // Sends current and new password to your backend
      await axios.put('/user/change-password', { 
        currentPassword: passwords.current, 
        newPassword: passwords.new 
      });

      toast.success('Password updated! Please log in again.');
      
      // Auto-logout after 2 seconds to ensure the new password is used
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="flex min-h-screen bg-googleGray w-full">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-10">
          <div className="max-w-4xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-light text-gray-900 flex items-center gap-3">
                <ShieldCheck className="text-googleBlue" size={32} /> Security Settings
              </h1>
              <p className="text-gray-500 mt-2">Manage your account security and privacy preferences.</p>
            </header>

            <div className="space-y-6">
              <div className="bg-white border border-googleBorder rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-50 text-googleBlue rounded-lg">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">Password & Authentication</h2>
                    <p className="text-sm text-gray-500">Keep your account secure with a strong password.</p>
                  </div>
                </div>
                
                {!showForm ? (
                  <div className="border-t pt-6">
                    <button 
                      onClick={() => setShowForm(true)}
                      className="px-4 py-2 bg-googleBlue text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="border-t pt-6 space-y-4 max-w-sm animate-fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Password</label>
                      <input 
                        type="password"
                        required
                        className="w-full p-2 border rounded-md outline-none focus:ring-1 focus:ring-googleBlue"
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Password</label>
                      <input 
                        type="password"
                        required
                        className="w-full p-2 border rounded-md outline-none focus:ring-1 focus:ring-googleBlue"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="px-4 py-2 bg-googleBlue text-white rounded-md text-sm font-medium">
                        Update Password
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 text-gray-500 text-sm hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="bg-white border border-googleBorder rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Eye size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">Privacy Context</h2>
                    <p className="text-sm text-gray-500">Currently managing data for your <span className="font-bold">{activeProfile?.profileType}</span> profile.</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                  Your <span className="font-medium text-gray-800">{activeProfile?.profileType}</span> profile data is isolated. 
                  Shared account info like your email (<strong>{user?.email}</strong>) is visible across all profiles.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Security;