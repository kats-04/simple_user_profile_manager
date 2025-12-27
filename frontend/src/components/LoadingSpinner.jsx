import React from 'react'; // THIS IS THE MISSING LINE

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default LoadingSpinner;