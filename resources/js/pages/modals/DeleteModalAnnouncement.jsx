import React from 'react';

const DeleteAnnouncementModal = ({ show, onClose, onConfirm, loading }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-96">
       <h3 className="text-xl leading-6 font-semibold text-gray-900 flex justify-center">Delete Announcement</h3>

        {/* Centered SVG Icon */}
        <div className="flex justify-center mt-4">
                <svg class="w-16 h-16 text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" 
                 width="24" 
                 height="24" 
                 fill="none" 
                 viewBox="0 0 24 24">
                <path stroke="red" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
                </div>
                
        <p className="mt-2 px-6 py-3  flex justify-center">
          Are you sure you want to delete this announcement?</p>

       <div className="flex items-center justify-between px-4 py-3 space-x-4">
          <button
            onClick={onClose}
             className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAnnouncementModal;
