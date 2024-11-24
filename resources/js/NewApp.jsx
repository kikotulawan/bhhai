import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/header';
import CustomSidebar from './components/sidebar';
import UsersTable from './pages/Registrant';
import Gallery from './pages/Gallery';
import UserList from './pages/UserList';
import CreateNotificationPage from './pages/CreateNotificationPage';
import Announcements from './pages/Announcements';
import AdminCreateNotification from './pages/AdminNotification'; 
import AdminDashboard from './pages/AdminDashboard';
import AdminGallery from './pages/AdminGallery';
import Profile from './pages/ProfileUser';
import ProtectedRoute from './components/ProtectedRoute'; 
import '../css/app.css';
import '../css/scroll.css';
import BoardDirectors from './pages/bod';
import Login from './pages/Login';
import NotificationComponent from './components/NotificationComponent';
import HouseList from './pages/HouseList';
import FamilyDetails from './pages/FamilyDetails';
import MyProfile from './pages/MyProfile';
import { setupAxiosInterceptors } from './axiosConfig';
import Error500Page from './pages/500errorpage'; 
import Notfound4page04 from './pages/notfound404'; 
import ResidentTable from './pages/ResidentRecord';
import AdminCreateSchedule from './pages/AdminCreateSchedule'; 
import AdminSpamNotifications from './pages/AdminSpamNotifications'; 
import AdminBlockAndLots from './pages/AdminBlockAndLots'; 
import AdminPaymentHistory from './pages/AdminPaymentHistory'; 
import AdminPaymentProcess from './pages/AdminPaymentProcess'; 
import AdminPaymentApproved from './pages/AdminPaymentApproved'; 
import AdminPaymentRejected from './pages/AdminPaymentRejected'; 
import AdminPaymentDelayed from './pages/AdminPaymentDelayed'; 
import AdminSettings from './pages/AdminSettings'; 
import ViewSchedules from './pages/ViewSchedules'; 
import Feedback from './pages/Feedback'; 

function NewApp() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const usertype = localStorage.getItem('usertype');

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  useEffect(() => {
    // Check if user type is set in localStorage
    const checkAuth = () => {
      const usertype = localStorage.getItem('usertype');
      if (!usertype) {
        navigate('/login'); // Redirect to login if user type is not found
      }
      setLoading(false); // End loading state
    };
  
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 768) {
        setIsMobile(true);
        setIsTablet(false);
        setIsSidebarCollapsed(true);
      } else if (windowWidth >= 768 && windowWidth < 1024) {
        setIsMobile(false);
        setIsTablet(true);
        setIsSidebarCollapsed(true);
      } else {
        setIsMobile(false);
        setIsTablet(false);
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    if (!usertype) {
      navigate('/login');
    }
  }, [usertype, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  return (
    <div className="flex flex-col h-screen">
      <NotificationComponent />
      {usertype && <Header toggleSidebar={toggleSidebar} />}
      <div className="flex flex-grow pt-16 overflow-hidden">
        {usertype && (
          <CustomSidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        )}
        <div className={`flex-grow bg-white overflow-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed && !isMobile ? 'ml-16' : 'ml-0 md:ml-64'}`}>
          <Routes>
          <Route path="/" element={<ProtectedRoute usertype={usertype}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/users" element={<ProtectedRoute usertype={usertype}><UserList /></ProtectedRoute>} />
            <Route path="/admin-announcements" element={<ProtectedRoute usertype={usertype}><Announcements /></ProtectedRoute>} />
            <Route path="/admin-gallery" element={<ProtectedRoute usertype={usertype}><AdminGallery /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute usertype={usertype}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/registrant" element={<ProtectedRoute usertype={usertype}><UsersTable /></ProtectedRoute>} />
            <Route path="/notification" element={<ProtectedRoute usertype={usertype}><AdminCreateNotification /></ProtectedRoute>} />
            <Route path="/resident-records" element={<ProtectedRoute usertype={usertype}><AdminCreateNotification /></ProtectedRoute>} />
            <Route path="/board-of-directors" element={<ProtectedRoute usertype={usertype}><BoardDirectors /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/create-notification" element={<ProtectedRoute><CreateNotificationPage /></ProtectedRoute>} />
            <Route path="/houselist" element={<ProtectedRoute><HouseList /></ProtectedRoute>} />
            <Route path="/AdminCreateSchedule" element={<ProtectedRoute><AdminCreateSchedule /></ProtectedRoute>} />
            <Route path="/AdminSpamNotifications" element={<ProtectedRoute><AdminSpamNotifications /></ProtectedRoute>} />
            <Route path="/AdminBlockAndLots" element={<ProtectedRoute><AdminBlockAndLots /></ProtectedRoute>} />
            <Route path="/AdminPaymentHistory" element={<ProtectedRoute><AdminPaymentHistory /></ProtectedRoute>} />
            <Route path="/AdminPaymentProcess" element={<ProtectedRoute><AdminPaymentProcess /></ProtectedRoute>} />
            <Route path="/AdminPaymentRejected" element={<ProtectedRoute><AdminPaymentRejected /></ProtectedRoute>} />
            <Route path="/AdminPaymentApproved" element={<ProtectedRoute><AdminPaymentApproved /></ProtectedRoute>} />
            <Route path="/AdminPaymentDelayed" element={<ProtectedRoute><AdminPaymentDelayed /></ProtectedRoute>} />
            <Route path="/AdminSettings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/500" element={<Error500Page />} />
            <Route path="/residentrecords" element={<ProtectedRoute><ResidentTable /></ProtectedRoute>} />
            <Route path="/Feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            <Route path="/404" element={<Notfound4page04 />} />
            <Route path="/viewSchedules" element={<ProtectedRoute><ViewSchedules /></ProtectedRoute>} />
            {/* Updated MyProfile Route with Wildcard for Nested Routes */}
            <Route path="/MyProfile/*" element={<MyProfile />} />
            <Route path="/family-details/:id" element={<FamilyDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default NewApp;
