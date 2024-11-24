import React from 'react';

function ProgressBar({ step }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full ${step >= 1 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
        <span className="mt-2 text-sm">Personal Info</span>
      </div>
      <div className={`flex-auto h-1 ${step > 1 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full ${step >= 2 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
        <span className="mt-2 text-sm">Contact Info</span>
      </div>
      <div className={`flex-auto h-1 ${step > 2 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full ${step >= 3 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
        <span className="mt-2 text-sm">Residency</span>
      </div>
    </div>
  );
}

export default ProgressBar;
