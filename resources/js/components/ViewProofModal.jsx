// src/components/ViewProofModal.js

import React from "react";

const ViewProofModal = ({ isOpen, onClose, proofUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <div className="inline-flex justify-between items-center w-full">
                    <h2 className="text-2xl font-bold mb-4">Proof of Payment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none mb-0 pb-0 -mt-4" 
                    >
                        <span className="text-4xl">&times;</span>
                    </button>
                </div>
                <div className="flex justify-center mb-4">
                    {proofUrl ? (
                        <img src={proofUrl} alt="Proof of Payment" className="max-w-full h-auto" />
                    ) : (
                        <p>No proof available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProofModal;
