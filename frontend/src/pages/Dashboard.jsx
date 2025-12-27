import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  // We explicitly extract 'loading' to prevent the ReferenceError
  const { activeProfile, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if no profile is selected after loading is finished
  useEffect(() => {
    if (!loading && !activeProfile) {
      navigate('/selection');
    }
  }, [loading, activeProfile, navigate]);

  // Helper to match colors with Selection.jsx
  const getProfileColor = (type) => {
    return type === 'Work' ? 'bg-blue-600' : 'bg-emerald-600';
  };

  // 1. Show a loading spinner while AuthContext initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // 2. Final safety check before rendering data
  if (!activeProfile || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-10">
          <div className="max-w-5xl mx-auto">
<header className="mb-10 flex items-center gap-6">
  {/* Dynamic Initial Avatar */}
  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm ${getProfileColor(activeProfile?.profileType)}`}>
    {activeProfile?.profileType?.charAt(0)}
  </div>
  <div>
    <h1 className="text-3xl font-light text-gray-900">
      {/* FIXED: Checks for firstName, then fullName, then lastName */}
      Welcome, <span className="font-semibold">
        {user?.firstName || user?.fullName || user?.lastName || 'User'}
      </span>
    </h1>
    <p className="text-gray-500 mt-1">
      Viewing your <span className="text-gray-800 font-medium">{activeProfile?.profileType}</span> profile
    </p>
  </div>
</header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* SHARED ACCOUNT CARD */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-6">Account Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                   <p className="text-gray-800 font-medium text-lg">
        {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User Name'}
      </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                    <p className="text-gray-800 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Age</label>
                    <p className="text-gray-800 font-medium">{user?.age}</p>
                  </div>
                </div>
              </div>

              {/* PROFILE SPECIFIC CARD */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className={`text-sm font-semibold uppercase tracking-widest mb-6 ${activeProfile?.profileType === 'Work' ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {activeProfile?.profileType} Context
                </h2>
                
                {activeProfile?.profileType === 'Work' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Professional Title</label>
                      <p className="text-gray-800 font-medium text-lg">{activeProfile.jobTitle || 'No title set'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Organization</label>
                      <p className="text-gray-800 font-medium">{activeProfile.company || 'Private'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Bio</label>
                      <p className="text-gray-800 font-medium italic">
                        "{activeProfile.bio || 'Tell us about yourself...'}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;