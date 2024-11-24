import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import ReactPlayer from 'react-player';
import ClipLoader from 'react-spinners/ClipLoader';

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
    return () => clearTimeout(timeout);
  }, [id]);

  const isVideo = (file) => {
    const videoExtensions = ['.mp4', '.mov', '.avi'];
    return videoExtensions.some((ext) => file.endsWith(ext));
  };

  const isPDF = (file) => file.endsWith('.pdf');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axiosInstance.get(`/announcements/${id}`);
        setAnnouncement(response.data);
      } catch (error) {
        setError('Failed to load announcement. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axiosInstance.get('/announcements');
        const sortedAnnouncements = response.data.sort(
          (a, b) => new Date(b.posted_date) - new Date(a.posted_date)
        );
        const filteredPosts = sortedAnnouncements.filter(
          (post) => post.id !== parseInt(id)
        );
        setRecentPosts(filteredPosts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };
    fetchRecentPosts();
  }, [id]);

  const postedDate = useMemo(
    () => (announcement?.posted_date ? new Date(announcement.posted_date).toLocaleString() : 'N/A'),
    [announcement?.posted_date]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-500 text-white p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Latest Announcement */}
          <div className="md:w-2/3 bg-white p-6  rounded-lg">
            <h1 className="text-5xl font-bold text-center font-sans text-gray-800">{announcement.title}</h1>
            <div className="relative mt-4">
            {isPDF(announcement.image) ? (
              <div className="flex justify-between items-center bg-[#FAFAFA] border border-gray-300 rounded-lg p-4">
                <div className="flex items-center">
                <svg
                        className="w-12 h-12 text-gray-800 dark:text-white mb-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"
                        />
                      </svg>
                  <div className="ml-4">
                    <p className="text-md font-medium font-sans text-gray-900">{announcement.image}</p>
                    <p className="text-sm text-gray-600 font-sans">Download PDF • {announcement.size} MB</p>
                  </div>
                </div>
                <a
                href={`/storage/${announcement.image}`}
                download
                className="ml-4 text-blue-600 hover:text-blue-800"
                aria-label="Download PDF"
              >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                fill="none" 
                viewBox="0 0 24 24">
                <path stroke="currentColor" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
                </svg>

              </a>
              </div>
            ) : isVideo(announcement.image) ? (
              <div className="w-full max-w-md mx-auto mt-4">
               <ReactPlayer
                url={`/storage/${announcement.image}`}
                controls
                width="100%"
                height="100%"
                className="rounded-md"
              />
              </div>
            ) : (
              <img
                src={`/storage/${announcement.image}`}
                alt="Announcement"
                className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-auto mx-auto mt-4 object-cover rounded-md"
              />
            )}
          </div>
            <p className="mt-6 text-gray-700 leading-relaxed text-justify font-sans text-md mb-6 whitespace-pre-line">{announcement.details}</p>
            <p className="text-sm text-gray-500 mt-4 text-right">Posted on: {postedDate}</p>
          </div>

          {/* Recent Announcements */}
          <div className="md:w-1/3">
            <h3 className="text-3xl font-semibold font-sans text-gray-800 mb-4">Recent Announcements</h3>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <Link
                  key={index}
                  to={`/announcements/${post.id}`}
                  className="flex items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-md p-4"
                >
                  {/* Left-side Content */}
                  <div className="w-1/3 flex-shrink-0 mr-4">
                    {post.image.endsWith('.pdf') ? (
                      <div className="flex justify-center items-center bg-[#FAFAFA] border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg
                            className="w-12 h-12 text-gray-800 dark:text-white mb-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : post.image.endsWith('.mp4') ? (
                      <div className="w-full max-w-md mx-auto mt-4">
                        <ReactPlayer
                          url={`/storage/${post.image}`}
                          controls
                          width="100%"
                          height="100%"
                          className="rounded-md"
                        />
                      </div>
                    ) : (
                      <img
                        src={`/storage/${post.image}`}
                        alt={post.title}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  {/* Right-side Content */}
                  <div className="w-2/3">
                    <h4 className="font-semibold text-lg font-sans text-gray-800">{post.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 font-sans">{post.details.substring(0, 80)}...</p>
                    <p className="text-xs text-gray-500 mt-2 font-sans">{new Date(post.posted_date).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

       {/* List of All Announcements */}
          <div className="p-4">
            <h3 className="text-3xl font-semibold font-sans text-gray-800 mb-4 text-center">List of Announcements</h3>
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mx-auto max-w-screen-lg ">
              {recentPosts.map((post, index) => (
                <Link
                  key={index}
                  to={`/announcements/${post.id}`}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border-2 border-gray-300"
                  style={{ width: '100%', height: '300px', margin: '0 auto' }}
                >
                  <div className="h-32 overflow-hidden flex items-center justify-center bg-gray-100 border-gray-300">
                    {post.image.endsWith('.pdf') ? (
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-800 dark:text-white mb-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
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
                    ) : post.image.endsWith('.mp4') ? (
                      <video className="w-full h-full object-cover" muted loop>
                        <source src={`/storage/${post.image}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={`/storage/${post.image}`}
                        alt="Announcement Image"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-2 flex-1 min-h-[150px]">
                    <h2 className="text-base font-semibold mb-1 font-sans">{post.title}</h2>
                    <p className="text-gray-600 mb-1 text-sm font-sans">
                      {post.details.length > 100 ? `${post.details.substring(0, 120)}...` : post.details}
                    </p>
                  </div>
                  <div className="p-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
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
                      <p className="text-xs text-gray-700 font-sans">{post.views || 0} views</p>
                    </div>
                    <p className="text-gray-500 text-xs font-sans">
                      {new Date(post.posted_date).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
