import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import UserInformation from './userInfo';
import UserAccountSettings from './UserAccountSetting';
import UserSidebar from './userSidebar'; 
import Dashboard from './Dashboard'; 
import Tenants from './Tenants'; 
import { fetchUserDetails } from '../api/user'; 
import ClipLoader from 'react-spinners/ClipLoader'; 
import ProtectedRoute from '../components/ProtectedRoute'; 

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setError('User is not authenticated');
      setLoading(false);
      return;
    }
  
    const getUserDetails = async () => {
      try {
        const data = await fetchUserDetails();
        if (data && data.id) {
          setUser(data);
          if (data.is_first_login) {
            navigate('/profile/user-account-settings?tab=password', { replace: true });
          }
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
  }, [navigate]);
  
  const handleAvatarUpdate = (newProfilePicUrl) => {
    setUser((prevUser) => ({
      ...prevUser,
      profilePic: newProfilePicUrl, 
    }));
  };

  const handleUserUpdate = (userDetails) => {
    console.log("UPDATED USER: ", userDetails)
    setUser(userDetails);
    if (userDetails.is_first_login == 0) {
      navigate('/profile/dashboard?refresh=true', { replace: true });
      window.location.reload();
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#1D4ED8" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const firstName = user?.firstName || 'User';
  const lastName = user?.lastName || '';
  const role = user?.role || 'User';

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <UserSidebar
          user={user}
          firstName={firstName}
          lastName={lastName}
          role={role}
          profilePic={user?.profilePic}
          isFirstLogin={user?.is_first_login} // Pass isFirstLogin prop
        />
        
        <div className="col-span-2 bg-white p-4 flex flex-col w-full border border-gray-300 rounded-lg shadow-md">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
            <Route path="tenants" element={<ProtectedRoute><Tenants user={user} /></ProtectedRoute>} />
            <Route path="user-info" element={<ProtectedRoute><UserInformation user={user} /></ProtectedRoute>} />
            <Route 
              path="user-account-settings" 
              element={<ProtectedRoute><UserAccountSettings user={user} onUserUpdate={handleUserUpdate}  /></ProtectedRoute>} 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
