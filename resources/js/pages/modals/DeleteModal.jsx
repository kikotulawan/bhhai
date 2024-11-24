import React from 'react';
import { BeatLoader } from 'react-spinners';

const DeleteModal = ({ show, onClose, onConfirm, title, content, loading }) => {
    const handleConfirm = async () => {
        await onConfirm();
        onClose(); // Close the modal on successful delete
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[999]">
            <div className="relative p-5 border w-full max-w-md mx-auto shadow-lg rounded-md bg-white">
                {/* Modal Title */}
                <div className="text-center">
                    <h3 className="text-xl leading-6 font-semibold text-gray-900">{title}</h3>
                </div>

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

                
                {/* Modal Content */}
                <div className="mt-2 px-6 py-3 flex justify-center">
                    <p className="text-gray-600">{content}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between px-4 py-3 space-x-4">

                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={loading}
                        >
                            Confirm
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default DeleteModal;
