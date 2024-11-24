import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ totalPages, currentPage, handlePageChange }) => (
  <div className="flex justify-center mt-4 mb-2 space-x-2">
    {/* Previous Button with Icon */}
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded-lg bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaChevronLeft size={18} />
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(index + 1)}
        className={`mx-1 px-3 py-1 border rounded-lg hover:bg-[#FFD181] hover:text-white text-base]  ${
          currentPage === index + 1
            ? 'bg-[#FFAB41] text-white'
            : 'bg-gray-300 text-gray-700'
        }`}
      >
        {index + 1}
      </button>
    ))}

    {/* Next Button with Icon */}
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded-lg bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaChevronRight size={18} />
    </button>
  </div>
);

export default Pagination;
