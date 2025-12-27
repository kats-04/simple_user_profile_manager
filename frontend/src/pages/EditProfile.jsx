import React from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const EditProfile = () => {
  const { user, activeProfile, setUser ,selectProfile, } = useContext(AuthContext);
  
  // Local state for the form
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    // Context-specific fields
    jobTitle: activeProfile?.jobTitle || '',
    company: activeProfile?.company || '',
    bio: activeProfile?.bio || '',
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // 1. Update Shared User Info (Name, Age)
    const userRes = await axios.put('/user/update', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: formData.age
    });

    // 2. Update Profile Specific Info (Bio, Job, etc.)
    const profileRes = await axios.put(`/profiles/${activeProfile._id}`, {
      jobTitle: formData.jobTitle,
      company: formData.company,
      bio: formData.bio
    });

    // 3. THE CRITICAL FIX: Extract the nested user data
    const updatedUserBase = userRes.data.user; 
    const updatedProfileCard = profileRes.data;

    // 4. Reconstruct the full User object with Profiles
    const fullUpdatedUser = {
      ...updatedUserBase,
      // Preserve the profiles array so the Dashboard doesn't go blank
      profiles: user.profiles.map(p => 
        p._id === updatedProfileCard._id ? updatedProfileCard : p
      )
    };

    // 5. Update Context & LocalStorage
    setUser(fullUpdatedUser);
    selectProfile(updatedProfileCard);
    
    localStorage.setItem('userInfo', JSON.stringify(fullUpdatedUser));
    localStorage.setItem('activeProfile', JSON.stringify(updatedProfileCard));

    toast.success('Profile updated successfully!');
    
    // Optional: Small delay then navigate back to see the changes
    setTimeout(() => navigate('/dashboard'), 500);

  } catch (err) {
    toast.error(err.response?.data?.message || 'Update failed');
  }
};
  return (
    <div className="flex min-h-screen bg-googleGray">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-10 max-w-4xl mx-auto">
          <div className="bg-white border border-googleBorder rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-light mb-8 text-gray-800 border-b pb-4">
              Edit {activeProfile?.profileType} Profile
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: Shared Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">First Name</label>
                  <input 
                    className="w-full p-3 border border-googleBorder rounded-lg focus:ring-2 focus:ring-googleBlue outline-none"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Last Name</label>
                  <input 
                    className="w-full p-3 border border-googleBorder rounded-lg focus:ring-2 focus:ring-googleBlue outline-none"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              {/* SECTION 2: Conditional Fields based on Context */}
              {activeProfile?.profileType === 'Work' ? (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Job Title</label>
                    <input 
                      className="w-full p-3 border border-googleBorder rounded-lg focus:ring-2 focus:ring-googleBlue outline-none"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Company</label>
                    <input 
                      className="w-full p-3 border border-googleBorder rounded-lg focus:ring-2 focus:ring-googleBlue outline-none"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Bio</label>
                  <textarea 
                    className="w-full p-3 border border-googleBorder rounded-lg focus:ring-2 focus:ring-googleBlue outline-none h-32"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              )}

              <button type="submit" className="bg-googleBlue text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;