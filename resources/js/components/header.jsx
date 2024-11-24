import React, { useState, useEffect, useRef } from 'react';
import { HiHome, HiCreditCard, HiSpeakerphone, HiBell, HiCog, HiMenu, HiLogout } from 'react-icons/hi';
import { MdArrowDropDown } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from './nav/navbarUtils';
import { fetchUserDetails, getprofilephoto } from '../api/user';
import axios from '../axiosConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState('/images/default-avatar.jpg');  // Set default image
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setUser(userDetails);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleMenu = (menu) => setActiveMenu((prev) => (prev === menu ? '' : menu));
  const toggleSubmenu = (submenu) => setActiveSubmenu((prev) => (prev === submenu ? '' : submenu));
  
  const handleProfileLogout = async () => {
    try {
      // Perform the logout API request
      await axios.post('/logout');
      
      // Clear the user's token and user type from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usertype');
      
      // Reset the state variables
      setIsLoggedIn(false);
      setUser(null);
      
      // Redirect the user to the login page
      navigate('/login', { replace: true });
  
      // Optional: Clear any other data in localStorage if needed
      localStorage.clear();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const profileData = await getprofilephoto(); // Fetch from API
        setSelectedImage(profileData.profilePic || '/images/default-avatar.jpg');  // Set default if no image
      } catch (error) {
        console.error('Error fetching profile photo:', error);
        setSelectedImage('/images/default-avatar.jpg');  // Set default on error
      } finally {
        setLoading(false);  // End loading regardless of success or error
      }
    };

    // Fetch profile photo only if not already set in user details
    if (!user?.profilePic) {
      fetchProfilePhoto();
    } else {
      setSelectedImage(user.profilePic);  // If user has profilePic, use it directly
    }
  }, [user]);

  return (
    <>
      <div className="h-16 bg-orange-500 text-white flex items-center justify-between px-4 z-50 fixed w-full top-0 left-0">
        {/* Left Section (Logo and Icons) */}
      <div className="flex items-center">
        <img src="/images/bhhai-logo.png" alt="Logo" className="h-10 w-10 mr-2" />
        <span className="text-lg font-bold font-poppins">BHHAI</span>
      </div>

        {/* Profile Section */}
        <div className="relative flex justify-end rounded-md px-2" ref={dropdownRef}>
          {loading ? (
            <span>Loading...</span>
          ) : isLoggedIn && user ? (
            <div
              className="flex items-center space-x-2 cursor-pointer p-2"
              onClick={toggleProfileDropdown}
            >
              <img
                src={selectedImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-md border border-gray-300"
                style={{
                  imageRendering: 'auto', 
                  filter: 'contrast(110%)', 
                }}
              />
              <div className="text-left font-semibold text-md font-sans">
                {user ? `${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}` : 'User'}
              </div>
              <MdArrowDropDown className="w-5 h-5 text-white" />
            </div>
          ) : (
            <button className="text-white focus:outline-none">Login</button>
          )}

          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-sm shadow-md py-2 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Link to="/Myprofile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
                  </svg>
                  My Profile
                </Link>
                <button
                  onClick={handleProfileLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <HiLogout className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right section (Menu button) */}
        <button onClick={handleMenuToggle} className="text-white focus:outline-none md:hidden p-2 rounded">
          <HiMenu className="w-6 h-6" />
        </button>
      </div>

          {isMenuOpen && (
            <div className="md:hidden relative w-full bg-[#FAFAFA] z-40 p-6 top-16">
              <div className="relative">
                <nav className="flex flex-col space-y-2">
                  <Link to="/admin-dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-100">
                    <HiHome className="w-5 h-5 mr-2" /> Dashboard
                  </Link>
                  <div>
                    <button
                      onClick={() => toggleMenu('payments')}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      <HiCreditCard className="w-5 h-5 mr-2" /> Payments
                      <MdArrowDropDown
                        className={`ml-auto w-5 h-5 transform transition-transform ${activeMenu === 'payments' ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {activeMenu === 'payments' && (
                      <div className="pl-8 space-y-1">
                        <Link to="/process-payments" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                          Process Payments
                        </Link>
                        <Link to="/payment-history" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                          Payment History
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link to="/Admin-Announcements" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-100">
                    <HiSpeakerphone className="w-5 h-5 mr-2" /> Posting
                  </Link>
                  <Link to="/notification" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-100">
                    <HiBell className="w-5 h-5 mr-2" /> Notification
                  </Link>

                  <div>
                    <button
                      onClick={() => toggleMenu('settings')}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      <HiCog className="w-5 h-5 mr-2" /> Settings
                      <MdArrowDropDown
                        className={`ml-auto w-5 h-5 transform transition-transform ${activeMenu === 'settings' ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {activeMenu === 'settings' && (
                      <div className="pl-8 space-y-1">
                        <button
                          onClick={() => toggleSubmenu('user')}
                          className="flex items-center w-full text-gray-700 hover:bg-orange-100 px-4 py-2"
                        >
                          User
                          <MdArrowDropDown
                            className={`ml-auto w-5 h-5 transform transition-transform ${activeSubmenu === 'user' ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {activeSubmenu === 'user' && (
                          <div className="pl-8 space-y-1">
                            <Link to="/users" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                              User List
                            </Link>
                            <Link to="/registrant" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                              Applicants
                            </Link>
                            <Link to="/residentrecords" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                              Residents Record
                            </Link>
                          </div>
                        )}
                        <Link to="/board-of-directors" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                          Board of Directors
                        </Link>
                        <Link to="/houselist" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                          House List
                        </Link>
                        <Link to="/AdminSpamNotifications" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                          Notification
                        </Link>
                        <Link to="/viewSchedules" className="block text-gray-700 hover:bg-orange-100 px-4 py-2">
                          Payment Setup
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          )}
        </>
      );
    };


export default Header;
