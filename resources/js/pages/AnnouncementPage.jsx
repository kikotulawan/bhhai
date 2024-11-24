import React, { useState, useEffect } from 'react';
import {  useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { Pagination } from 'flowbite-react';
import ClipLoader from 'react-spinners/ClipLoader';

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axiosInstance.get('/announcements');
        const sortedAnnouncements = response.data.sort(
          (a, b) => new Date(b.posted_date) - new Date(a.posted_date)
        );
        
        setAnnouncements(sortedAnnouncements);
        setFilteredAnnouncements(sortedAnnouncements);

      } catch (error) {
        console.error('Error fetching announcements:', error);
        setError('Failed to load announcements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const results = announcements.filter((announcement) =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAnnouncements(results);
    }
    setCurrentPage(1);

    
    if(announcements.length > 0) {
      navigate(`/announcements/${announcements[0].id}`)
    }
  }, [searchTerm, announcements]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const isVideo = (file) => {
    const videoExtensions = ['.mp4', '.mov', '.avi'];
    return videoExtensions.some((ext) => file.endsWith(ext));
  };

  const isPDF = (file) => {
    return file.endsWith('.pdf');
  };

  const handleLongPress = (e) => {
    const videoElement = e.target;
    let longPressTimeout;

    videoElement.addEventListener('touchstart', () => {
      longPressTimeout = setTimeout(() => {
        videoElement.play();
      }, 500);
    });

    videoElement.addEventListener('touchend', () => {
      clearTimeout(longPressTimeout);
      videoElement.pause();
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-full overflow-y-auto bg-[#FAFAFA]">
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}

      <div
        className="relative w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/announcement.jpg)' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-extrabold text-center text-white py-6 px-4 rounded-lg shadow-lg">
            Announcements
          </h1>
        </div>
      </div>

      <div className="mb-3 mt-6 flex justify-center px-4">
        <div className="relative w-full max-w-md">
          <svg
            className="absolute inset-y-0 left-3 w-6 h-6 text-gray-800 dark:text-white flex items-center justify-center mt-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="gray"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 pl-12 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:border-blue-400"
          />
        </div>
      </div>

      <div className="container mx-auto max-w-5xl flex-grow">
        {currentAnnouncements.length === 0 ? (
          <div className="text-center text-gray-600 text-xl">
            No announcements found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
            {currentAnnouncements.map((announcement, index) => (
              <Link
                key={index}
                to={`/announcements/${announcement.id}`}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border-2 border-gray-300"
                style={{ width: '100%', height: '300px', margin: '0 auto' }}
              >
                <div className="h-32 overflow-hidden flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg">
                  {isPDF(announcement.image) ? (
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-800 dark:text-white mb-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1 -1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"
                        />
                      </svg>
                    </div>
                  ) : isVideo(announcement.image) ? (
                    <video
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                      onTouchStart={handleLongPress}
                    >
                      <source src={`/storage/${announcement.image}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`/storage/${announcement.image}`}
                      alt="Announcement Image"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2 flex-1 min-h-[150px]">
                  <h2 className="text-sm font-semibold mb-1">{announcement.title}</h2>
                  <p className="text-gray-600 mb-1 text-xs">
                    {announcement.details.length > 60
                      ? `${announcement.details.substring(0, 60)}...`
                      : announcement.details}
                  </p>
                </div>
                <div className="p-2 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                      />
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M15 12a3 3 0 1 1 -6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    <p className="text-xs text-gray-700 font-sans">{announcement.views || 0} views</p>
                  </div>
                  <p className="text-gray-500 text-xs font-sans">{new Date(announcement.posted_date).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6 mb-4 px-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAnnouncements.length / itemsPerPage)}
          onPageChange={onPageChange}
          showIcons={true}
        />
      </div>
    </div>
  );
};

export default UserAnnouncements;
