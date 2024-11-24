import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { HiX } from 'react-icons/hi';

const UpdateAnnouncementModal = ({ show, onClose, onConfirm, announcement, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    posted_date: '',
  });

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        details: announcement.details,
        posted_date: announcement.posted_date,
      });
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onConfirm(announcement.id, formData);
  };

  if (!show || !announcement) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-6 border w-full max-w-lg mx-auto shadow-lg rounded-md bg-white">
        {/* Modal Header */}
        <div className="relative mb-5">
          <h3 className="text-xl font-semibold text-gray-900 text-center">Update Announcement</h3>
          {/* X Button for Closing */}
          <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
              <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Details Textarea */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="details">
              Details
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              rows="6"
              style={{ resize: 'none', overflowY: 'auto' }}  // Disable resizing and make scrollable
              required
            />
          </div>

          {/* Posted Date Input */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="posted_date">
              Posted Date
            </label>
            <input
              type="datetime-local"
              id="posted_date"
              name="posted_date"
              value={formData.posted_date}
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <BeatLoader size={10} color="#fff" />
                  <span className="ml-2">Updating...</span>
                </div>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAnnouncementModal;
