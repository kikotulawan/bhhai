import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {useLocation } from 'react-router-dom';
import Toast from '../components/Toast';
import ReactPlayer from 'react-player'; 
import {
  fetchAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../api/user';
import AddAnnouncementModal from './modals/AddAnnouncementModal';
import UpdateAnnouncementModal from './modals/UpdateModalAnnouncement';
import DeleteAnnouncementModal from './modals/DeleteModalAnnouncement';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/pagination';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const location = useLocation(); 
  const crumbs = getBreadcrumbs(location);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAnnouncements();
        const sortedData = data.sort(
          (a, b) => new Date(b.posted_date) - new Date(a.posted_date)
        );
        setAnnouncements(sortedData);
      } catch (error) {
        setError('Failed to fetch announcements. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const indexOfLastAnnouncement = currentPage * entriesPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - entriesPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(announcements.length / entriesPerPage);

  const handleAddAnnouncement = async (formData) => {
    setLoading(true);
    try {
      const newAnnouncement = await addAnnouncement(formData);
      setAnnouncements([newAnnouncement, ...announcements]);
      setShowAddModal(false);
  
      // Show success toast
      setSuccessMessage('Announcement successfully added!');
      setShowToast(true);
  
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('Failed to add announcement. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateAnnouncement = async (id, formData) => {
    setLoading(true);
    try {
      const updatedAnnouncement = await updateAnnouncement(id, formData);
      setAnnouncements(
        announcements.map((a) => (a.id === id ? updatedAnnouncement : a))
      );
      setShowUpdateModal(false);
  
      // Show success toast
      setSuccessMessage('Announcement successfully updated!');
      setShowToast(true);
  
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('Failed to update announcement. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    setLoading(true);
    try {
      await deleteAnnouncement(id);
      // Remove the deleted announcement from the list
      setAnnouncements(announcements.filter((a) => a.id !== id));
      setShowDeleteModal(false); // Close the delete modal
      setCurrentAnnouncement(null); // Reset the current announcement
  
      // Show the toast notification
      setSuccessMessage('Announcement successfully deleted!');
      setShowToast(true);
  
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('Failed to delete announcement. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase(); // Ensure search is case-insensitive
    setSearchQuery(query);

    fetchAnnouncements()  // Always fetch announcements first
      .then((data) => {
        // Filter announcements based on search query
        const filtered = data.filter((announcement) => {
          const announcementDate = new Date(announcement.posted_date).toLocaleDateString();
          return (
            announcement.title.toLowerCase().includes(query) || // Search by title
            announcementDate.includes(query) // Search by date
          );
        });

        // Sort the filtered results by posted_date in descending order
        const sortedFiltered = filtered.sort(
          (a, b) => new Date(b.posted_date) - new Date(a.posted_date)
        );
        setAnnouncements(sortedFiltered);
      })
      .catch((error) => console.error("Failed to fetch announcements:", error));
};


  return (
    <div className="min-h-screen relative overflow-x-auto shadow-md sm:rounded-lg p-4 bg-[#FAFAFA]">
       
       {/*Toast */}
       {showToast && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

    {/* Error Message */}
    {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}

          {/* BreadCrumbs Section */}
          <div className="bg-white rounded-md mb-2">
            <Breadcrumbs crumbs={crumbs} />
          </div>
      
      <h1 className="text-center text-4xl font-bold p-4">Announcement</h1>

      {/* Controls Section */}
      <div className="mb-4 px-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="relative flex-grow">
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              >
              <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
              </svg>
              <input
                type="text"
                placeholder="Search announcements"
                value={searchQuery}
                onChange={handleSearch}
                className="form-input w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="entries" className="mr-2">
                Show
              </label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={handleEntriesChange}
                className="form-select border border-gray-300 rounded"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="ml-2">entries</span>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 flex items-center"
          >
            Add Announcement
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border-y border-gray-300 shadow-sm">
        <table className="table-auto min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-medium">
              <th className="px-6 py-3 text-center">Media</th>
              <th className="px-6 py-3 text-center">Title</th>
              <th className="px-6 py-3 text-center col-span-2">Details</th>
              <th className="px-6 py-3 text-center">Posted Date</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAnnouncements.length > 0 ? (
              currentAnnouncements.map((announcement, index) => (
                <tr key={index} className="border-b border-gray-200 text-center">
                  <td className="px-6 py-4">
                    {announcement.image.endsWith('.mp4') || announcement.image.endsWith('.mov') || announcement.image.endsWith('.avi') ? (
                      <div className="relative w-64 h-36">
                        <ReactPlayer 
                          url={`/storage/${announcement.image}`} 
                          controls 
                          width="100%" 
                          height="100%" 
                          style={{ position: 'relative' }} 
                        />
                      </div>
                    ) : announcement.image.endsWith('.pdf') ? (
                      <a
                          href={`/storage/${announcement.image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FFAB41] underline flex items-center justify-center transition duration-200 ease-in-out transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg p-2 rounded cursor-pointer"
                        >
                          <svg 
                            className="w-16 h-16 text-red-800 dark:text-white" 
                            aria-hidden="true" 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z" 
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                    ) : (
                      <img
                        src={`/storage/${announcement.image}`}
                        alt="Announcement"
                        className="w-64 h-36 object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">{announcement.title}</td>
                  <td className="px-6 py-4 col-span-2 word-wrap">
                    {announcement.details.length > 100
                      ? `${announcement.details.substring(0, 100)}...`
                      : announcement.details}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(announcement.posted_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setCurrentAnnouncement(announcement);
                          setShowUpdateModal(true);
                        }}
                        className="bg-[#1D4ED8] text-white p-2 rounded hover:bg-blue-800 text-xs sm:text-base flex items-center"
                      >
                        <FaEdit className="mr-1" /> 
                        Update
                      </button>
                      
                      <button
                        onClick={() => {
                          setCurrentAnnouncement(announcement);
                          setShowDeleteModal(true);
                        }}
                        className="bg-[#C81E1E] text-white p-2 rounded hover:bg-red-800 text-xs sm:text-base flex items-center"
                      >
                        <FaTrash className="mr-1" /> 
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 text-center" colSpan="6">
                  No announcements available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />

      <AddAnnouncementModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddAnnouncement}
        loading={loading}
      />

      <UpdateAnnouncementModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleUpdateAnnouncement}
        announcement={currentAnnouncement}
        loading={loading}
      />

      <DeleteAnnouncementModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteAnnouncement(currentAnnouncement?.id)}
        loading={loading}
      />
    </div>
  );
};



export default Announcements;
