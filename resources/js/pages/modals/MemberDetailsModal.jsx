import React from 'react';
import { Dialog } from '@headlessui/react'; 
import { HiX } from 'react-icons/hi';

const MemberDetailsModal = ({ isOpen, onClose, member }) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" aria-hidden="true" />
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <HiX className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <img
            src={`/storage/${member.image || 'board_members/default-avatar.png'}`} 
            alt={`${member.user.firstName} ${member.user.lastName}'s photo`}
            className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-gray-300 shadow-md"
          />
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 text-center">
            {`${member.user.firstName} ${member.user.lastName}`}
          </h2>

          {/* Use flexbox for centered alignment */}
          <div className="flex flex-col items-center text-lg text-gray-700 w-full">
            {/* Adjusted width to be responsive */}
            <div className="flex justify-between w-full sm:w-1/2 mb-2 px-2">
              <p className="text-left font-medium">Position:</p>
              <p className="text-right">{member.position}</p>
            </div>
            <div className="flex justify-between w-full sm:w-1/2 mb-2 px-2">
              <p className="text-left font-medium">Start of Term:</p>
              <p className="text-right">{member.start_of_term}</p>
            </div>
            <div className="flex justify-between w-full sm:w-1/2 px-2">
              <p className="text-left font-medium">End of Term:</p>
              <p className="text-right">{member.end_of_term}</p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default MemberDetailsModal;
