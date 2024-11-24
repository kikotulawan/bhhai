import React, { useEffect, useState } from 'react';

const CustomToast = ({ message, type = 'error', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  // Determine the background color based on the type
  const backgroundColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-lg shadow-lg flex items-center ${backgroundColor} text-white transition-transform duration-300`}
      role="alert"
    >
      {/* Conditionally render the appropriate SVG icon */}
      {type === 'success' ? (
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 mr-2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
      )}
      <span className="flex-1 text-center">{message}</span>
      <button
        type="button"
        className="ml-4 text-white hover:text-gray-200"
        onClick={() => setVisible(false)}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default CustomToast;
