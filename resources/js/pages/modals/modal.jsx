import React, { useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

const Modal = ({ show, onClose, onConfirm, title, children, loading }) => {
    useEffect(() => {
        if (show) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [show]);

    if (!show) {
        return null;
    }

    const handleConfirm = () => {
        console.log('Modal confirm button clicked');
        onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative p-5 border w-full max-w-md mx-auto shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-semibold text-gray-900">{title}</h3>
                    {loading && (
                        <div className="flex justify-center mt-4">
                            <BeatLoader color="#4A90E2" />
                        </div>
                    )}

                    <div className="mt-2 px-7 py-3">
                        {children}
                    </div>
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
        </div>
    );
};

export default Modal;
