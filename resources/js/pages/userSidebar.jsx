import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../components/nav/navbarUtils';
import ClipLoader from 'react-spinners/ClipLoader';
import { getprofilephoto } from '../api/user';

const UserSidebar = ({ user = {}, firstName = '', lastName = '', middleName = '', role, profilePic, isFirstLogin }) => {
  const [selectedImage, setSelectedImage] = useState(profilePic || '/images/avatar-default.jpg');
  const [loading, setLoading] = useState(!profilePic);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      setLoading(true);
      try {
        const profileData = await getprofilephoto();
        setSelectedImage(profileData.profilePic ? `${profileData.profilePic}?${new Date().getTime()}` : '/images/avatar-default.jpg');
      } catch (error) {
        console.error('Error fetching profile photo:', error);
        setSelectedImage('/images/avatar-default.jpg');
      } finally {
        setLoading(false);
      }
    };
  
    // If profilePic is already available, use it; otherwise, fetch it.
    if (profilePic) {
      setSelectedImage(profilePic);
      setLoading(false);
    } else {
      fetchProfilePhoto();
    }
  }, [profilePic]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#1D4ED8" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-md text-center w-full md:w-auto h-fit flex flex-col items-center justify-center">
      <div className="mb-4 flex flex-col items-center p-2">
      <img
          src={selectedImage}
          alt="Profile"
          className="w-44 h-44 rounded-md object-cover shadow-md border border-gray-300"
          style={{
            imageRendering: 'auto',
            filter: 'contrast(110%)',
          }}
        />
        <h3 className="mt-2 text-xl font-bold">
          {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(middleName)} {capitalizeFirstLetter(lastName)}
        </h3>
        <p className="text-sm text-gray-500">{role || 'User'}</p>
      </div>

      <div className="flex flex-col space-y-4 items-start w-full">
        <Link
          to="/profile/dashboard"
          className={`flex items-center text-gray-700 px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 ${
            isFirstLogin ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <svg className="w-6 h-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zM13 3v6h8V3h-8z" />
          </svg>
          <span className="text-base">Payments</span>
        </Link>

          {(user.role == 'Homeowner' && user.is_account_holder == 1) &&
            <Link
              to="/profile/tenants"
              className={`flex items-center text-gray-700 px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 ${
                isFirstLogin ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <img width="20" height="20" className='opacity-[.8]' src="https://img.icons8.com/ios-glyphs/30/group.png" alt="group"/>
              <span className="text-base ml-3">Tenants</span>
            </Link>
          }

        <Link
          to="/profile/user-info"
          className={`flex items-center text-gray-700 px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 ${
            isFirstLogin ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <svg className="w-5 h-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
          </svg>
          <span className="text-base ">User Information</span>
        </Link>

        <Link
          to="/profile/user-account-settings"
          className="flex items-center text-gray-700 px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          <svg className="w-6 h-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-base">User Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default UserSidebar;
