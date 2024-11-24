import React, { useState } from "react";
import FileUpload from "./FileUpload"; // Import the file upload component

const PaymentModal = ({ isOpen, onClose, onConfirm, month, year, totalAmount }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (selectedFile) => {
        setFile(selectedFile); // Handle the selected file
    };

    const handleConfirm = () => {
        if (!file) {
            alert("Please upload a proof of payment.");
            return;
        }
        // Pass file data along with month and year to the parent or backend for payment processing
        onConfirm(file);
        onClose();
    };

    if (!isOpen) return null;

    const monthName = new Date(0, month - 1).toLocaleString("default", {
        month: "long",
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Confirm Payment
                </h2>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to add a payment for{" "}
                    <span className="font-bold">{monthName} {year}</span>?
                </p>
                <p className="text-gray-700 mb-6">
                    Total Amount to Pay: <span className="font-bold">PHP {totalAmount}</span>
                </p>
                {/* File upload component */}
                <FileUpload onFileChange={handleFileChange} />

                <div className="flex justify-end gap-4 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
