import React, { useState } from 'react';

const FileUpload = ({ onFileChange }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type and size
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
                setError("Please upload a valid image file (JPEG, PNG, JPG).");
                setFile(null); // Clear previous file
            } else if (selectedFile.size > 2048 * 1024) { // 2MB size limit
                setError("File size should be less than 2MB.");
                setFile(null); // Clear previous file
            } else {
                setError(null); // No error
                setFile(selectedFile);
                onFileChange(selectedFile); // Send the file to parent component
            }
        }
    };

    return (
        <div className="file-upload">
            <label className="block text-sm font-medium text-gray-700">Upload Proof of Payment</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm mt-2"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {file && <p className="text-green-500 mt-2">File selected: {file.name}</p>}
        </div>
    );
};

export default FileUpload;
