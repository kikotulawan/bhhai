import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AdminInformation from './AdminInformation';
import AccountSettings from './AccountSettings';
import ContactInformation from './AdminContactInformation';
import AdminSidebar from './AdminSidebar'; 
import { fetchUserDetails } from '../api/user'; 
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';
import BeatLoader from 'react-spinners/BeatLoader';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); 
  const crumbs = getBreadcrumbs(location);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const data = await fetchUserDetails();
        if (data && data.id) {
          setUser(data);  
        } else {
          console.error("Fetched user data does not include an ID");
        }
      } catch (err) {
        setError('Error fetching user details');
      } finally {
        setLoading(false);
      }
    };
  
    getUserDetails();
  }, []);

  const handleAvatarUpdate = (newProfilePicUrl) => {
    setUser((prevUser) => ({
        ...prevUser,
        profilePic: newProfilePicUrl, // Update the state with new profile picture URL
    }));
};

  if (loading) {
    <div className="flex justify-center items-center min-h-screen">
    <BeatLoader color="#1D4ED8" loading={loading} size={20} />
  </div>
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Loading and error handling
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BeatLoader color="#1D4ED8" loading={loading} size={20} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const firstName = user?.firstName || 'Administrator';
  const lastName = user?.lastName || '';
  const role = user?.role || 'Administrator';

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4">
      
      {/* BreadCrumbs Section */}
      <div className="bg-[#ffedcc;] rounded-md mb-2  ">
            <Breadcrumbs crumbs={crumbs} />
            </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <AdminSidebar firstName={firstName} lastName={lastName} role={role} profilePic={user?.profilePic} />
        
        <div className="col-span-2 bg-white p-4 flex flex-col w-full border border-gray-300 rounded-sm shadow-sm">
          <Routes>
            <Route path="/" element={<Navigate to="admin-info" />} />
            <Route path="admin-info" element={<AdminInformation user={user} />} />
            <Route path="contact-info" element={<ContactInformation user={user} />} />
            <Route path="account-settings" element={<AccountSettings user={user} onAvatarUpdate={handleAvatarUpdate} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};


export default MyProfile;
