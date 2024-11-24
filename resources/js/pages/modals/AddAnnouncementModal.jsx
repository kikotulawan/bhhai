import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BeatLoader } from 'react-spinners';
import { HiX } from 'react-icons/hi'; 
import '../../../css/scroll.css';

const AddAnnouncementModal = ({ show, onClose, onConfirm, loading }) => {
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [postedDate, setPostedDate] = useState('');

  const modalRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const localDateTime = new Date(postedDate);
    const correctedDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000).toISOString();
  
    const formData = new FormData();
    formData.append('media', media);
    formData.append('title', title);
    formData.append('details', details);
    formData.append('posted_date', correctedDateTime);

    // Reset the form fields
    setMedia(null);
    setMediaPreview(null);
    setTitle('');
    setDetails('');
    setPostedDate('');
        
    await onConfirm(formData);
    onClose(); // Close the modal on successful addition
  };

  // Close the modal if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  const fileName = useMemo(() => {
    if (!media) return '';
    return media.name; // Use the media file's name directly
  }, [media]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div
        ref={modalRef}
        className="relative w-full max-w-full sm:max-w-lg lg:max-w-2xl bg-white shadow-lg rounded-md p-6 sm:p-8 overflow-y-auto max-h-full"
      >
        {/* Modal Header */}
        <div className="relative mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">Add Announcement</h3>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              rows="6"
              style={{ resize: 'none', overflowY: 'auto' }}
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
              value={postedDate}
              onChange={(e) => setPostedDate(e.target.value)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Media Input and Preview */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="media">
              Upload Image/Video/Pdf
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              id="media"
              type="file"
              name="media"
              accept="image/*,video/*"
              onChange={handleFileChange}
              required
            />
            {mediaPreview && (
              <div className="mt-3">
                {media?.type.startsWith('video/') ? (
                  <video controls className="w-full h-40 object-cover rounded-lg shadow-md">
                    <source src={mediaPreview} type={media.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <BeatLoader size={10} color="#fff" />
                  <span className="ml-2">Posting...</span>
                </div>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncementModal;
