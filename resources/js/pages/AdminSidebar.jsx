import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../components/nav/navbarUtils';
import BeatLoader from 'react-spinners/BeatLoader';
import { getprofilephoto } from '../api/user';

const AdminSidebar = ({ firstName = '', lastName = '', middleName = '', role, profilePic }) => {
  const [selectedImage, setSelectedImage] = useState(profilePic || '/images/default-avatar.jpg');
  const [loading, setLoading] = useState(!profilePic); 

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const profileData = await getprofilephoto(); 
        setSelectedImage(profileData.profilePic || '/images/default-avatar.jpg');  
      } catch (error) {
        console.error('Error fetching profile photo:', error);
        setSelectedImage('/images/default-avatar.jpg');  
      } finally {
        setLoading(false);  
      }
    };
  
    if (profilePic) {
      // When profilePic is provided or updated, use it directly
      setSelectedImage(profilePic);
      setLoading(false);  // Set loading to false once profilePic is set
    } else {
      // If no profilePic, fetch it from the API (e.g., default or existing one)
      fetchProfilePhoto();
    }
  }, [profilePic]);  // Trigger re-run when profilePic changes
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BeatLoader color="#1D4ED8" loading={loading} size={20} />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-sm shadow-sm text-center w-full md:w-auto h-[450px] flex flex-col items-center justify-center">
      {/* Profile picture section */}
      <div className="mb-4 flex flex-col items-center p-2">
        <img
          src={selectedImage}
          alt="Profile"
          className="w-44 h-44 rounded-sm object-cover  border border-gray-300"
          style={{
            imageRendering: 'auto', 
            filter: 'contrast(110%)', 
          }}
        />
        <h3 className="mt-2 text-2xl font-bold">
          {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(middleName)} {capitalizeFirstLetter(lastName)}
        </h3>
        <p className="text-sm text-gray-500">{role || 'Administrator'}</p>
      </div>

      {/* Sidebar links */}
      <div className="flex flex-col space-y-4 items-start w-full">
        <Link
          to="/MyProfile/admin-info"
          className="flex items-center text-gray-700 px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          <svg
            className="w-5 h-6 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
          </svg>
          <span className="text-base">Admin Information</span>
        </Link>

        <Link
          to="/MyProfile/contact-info"
          className="flex items-center text-gray-700 px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          <svg   
            className="w-6 h-6 mr-3"
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
            viewBox="0 0 24 24">
            <path  d="M4 4a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2v14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2V5a1 1 0 0 1-1-1Zm5 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Zm-5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Zm-3 4a2 2 0 0 0-2 2v3h2v-3h2v3h2v-3a2 2 0 0 0-2-2h-2Z"/>
          </svg>

          <span className="text-base">Company Information</span>
        </Link>


        <Link
          to="/MyProfile/account-settings"
          className="flex items-center text-gray-700 px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          <svg
            className="w-6 h-6 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-base">Account Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
