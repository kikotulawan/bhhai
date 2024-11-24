import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNavbarState } from './useNavbarState';
import { handleLogout, capitalizeFirstLetter, toggleDropdown } from './navbarUtils';
import Notifications from './Notifications';
import { getprofilephoto } from '../../api/user';
import { MdArrowDropDown } from 'react-icons/md';

function Navbar({ missionRef, visionRef, boardRef }) {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isLoggedIn,
    user,
    setIsLoggedIn,
    setUser,
    loading,
    setLoading,
    scrolled,
    hasScrolledMargin,
  } = useNavbarState();

  const navigate = useNavigate();
  const location = useLocation();
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('/images/avatar-default.jpg');

  const scrollToSection = (sectionRef) => {
    if (location.pathname !== '/about') {
      // Navigate to /about first, then scroll
      navigate('/about');
      // Wait for navigation to complete, then scroll to section
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Small delay to allow AboutPage to render
    } else {
      // If already on /about, directly scroll to the section
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    setAboutDropdownOpen(false); // Close dropdown after clicking
  };


  // Check for is_first_login and handle redirection
  useEffect(() => {
    if (user?.is_first_login) {
      navigate('/profile/user-account-settings?tab=password', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const profileData = await getprofilephoto();
        setSelectedImage(profileData.profilePic ? `${profileData.profilePic}?${new Date().getTime()}` : '/images/avatar-default.jpg');
      } catch (error) {
        console.error('Error fetching profile photo:', error);
        setSelectedImage('/images/avatar-default.jpg');
      }
    };
  
    // Use the profilePic if available, otherwise fetch it
    if (user?.profilePic) {
      setSelectedImage(user.profilePic);
    } else {
      fetchProfilePhoto();
    }
  }, [user]);
  
  return (
    <nav className={`p-2 sticky top-0 z-50 transition duration-300 ease-in-out ${scrolled ? 'bg-[#F2F0E4] bg-opacity-30 backdrop-blur-lg shadow-lg' : 'bg-[#F0F0F0]'} ${hasScrolledMargin ? 'mt-4' : ''}`}>
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center">
        <img src="/images/bhhai-logo.png" alt="Logo" className="h-10 w-10 mr-4 md:h-14 md:w-14" />
        <div className="text-[#333333] text-xl md:text-2xl font-bold font-poppins">BHHAI</div>
      </div>

        {/* Notification Icon for Mobile */}
        <div className="md:hidden flex items-center">
          {isLoggedIn && (
            <Notifications
              isNotificationOpen={isNotificationOpen}
              setIsNotificationOpen={setIsNotificationOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          )}
          <button className="text-[#555555] ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

{/* Desktop Navigation Links */}
<div className="hidden md:flex items-center space-x-4 lg:space-x-8 px-2 lg:px-4 ">
  <Link
    to="/home"
    className={`relative group text-sm lg:text-base text-[#333333] transition duration-300 ease-in-out ${
      location.pathname === '/home' || location.pathname === '/' ? 'text-[#444444]' : 'hover:text-[#333333]'
    }`}
  >
    Home
    <span
      className={`absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#333333] scale-x-0 group-hover:scale-x-100 ${
        location.pathname === '/home' || location.pathname === '/' ? 'scale-x-100' : ''
      } origin-left transition-transform duration-300 ease-in-out`}
    ></span>
  </Link>

  <Link
    to="/announcement"
    className={`relative group text-sm lg:text-base text-[#333333] transition duration-300 ease-in-out ${
      location.pathname === '/announcement' ? 'text-[#444444]' : 'hover:text-[#444444]'
    }`}
  >
    Announcements
    <span
      className={`absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#333333] scale-x-0 group-hover:scale-x-100 ${
        location.pathname === '/announcement' ? 'scale-x-100' : ''
      } origin-left transition-transform duration-300 ease-in-out`}
    ></span>
  </Link>

  <Link
    to="/gallery"
    className={`relative group text-sm lg:text-base text-[#333333] transition duration-300 ease-in-out ${
      location.pathname === '/gallery' ? 'text-[#444444]' : 'hover:text-[#444444]'
    }`}
  >
    Gallery
    <span
      className={`absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#333333] scale-x-0 group-hover:scale-x-100 ${
        location.pathname === '/gallery' ? 'scale-x-100' : ''
      } origin-left transition-transform duration-300 ease-in-out`}
    ></span>
  </Link>

  {/* About with Dropdown */}
  <div className="relative flex items-center space-x-1">
    <Link
      to="/about"
      className="text-sm lg:text-base text-[#333333] hover:text-[#444444] transition duration-300 ease-in-out"
      onClick={() => setAboutDropdownOpen(false)}
    >
      About
    </Link>

    <button
      onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
      className="text-[#333333] hover:text-[#444444] transition duration-300 ease-in-out flex items-center"
      aria-label="Toggle About Submenu"
    >
      <MdArrowDropDown className={`ml-1 transition-transform duration-300 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
    </button>

    {/* Dropdown Menu */}
    {aboutDropdownOpen && (
      <div className="absolute z-40 right-0 w-40 bg-[#F0F0F0] ring-1 ring-black ring-opacity-5 top-12 overflow-hidden">
        <ul className="p-0">
          <li>
            <button
              onClick={() => scrollToSection(missionRef)}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r from-[#F28705] to-[#F25C05] transition-all duration-300 ease-in-out"
            >
              Mission
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(visionRef)}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r from-[#F28705] to-[#F25C05] transition-all duration-300 ease-in-out"
            >
              Vision
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(boardRef)}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r from-[#F28705] to-[#F25C05] transition-all duration-300 ease-in-out"
            >
              Board Of Directors
            </button>
          </li>
        </ul>
      </div>
    )}
  </div>

  <Link
            to="/contactus"
            className={`relative group text-[#333333] transition duration-300 ease-in-out ${
              location.pathname === '/contactus' ? 'text-[#444444]' : 'hover:text-[#444444]'
            }`}
          >
            Contact Us
            <span
              className={`absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#333333] scale-x-0 group-hover:scale-x-100 ${
                location.pathname === '/contactus' ? 'scale-x-100' : ''
              } origin-left transition-transform duration-300 ease-in-out`}
              
            ></span>
          </Link>
</div>


        {/* User Menu for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn && (
            <Notifications
              isNotificationOpen={isNotificationOpen}
              setIsNotificationOpen={setIsNotificationOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          )}
          {isLoggedIn && user ? (
            <div className="relative flex items-center py-2">
              <button
                onClick={() => toggleDropdown(isDropdownOpen, setIsDropdownOpen, setIsNotificationOpen)}
                className="flex items-center text-sm"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  src={selectedImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover shadow-md border border-gray-500"
                  style={{ imageRendering: 'auto' }}
                />
                <span className="ml-2 text-gray-800 font-semibold">
                  {user ? `${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}` : 'User'}
                </span>
                <MdArrowDropDown className="ml-2 w-5 h-5 ext-gray-800" />
              </button>
              {isDropdownOpen && (
                <div className="z-40 absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-2 ring-1 ring-black ring-opacity-5 top-14">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >

                        <path
                          stroke="#414141"
                         d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
                      </svg>
                      My Profile
                    </Link>
                    <button
                      onClick={() => handleLogout(setIsLoggedIn, setUser, navigate)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-gray-700"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#414141"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#414141"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              {/* <Link
                to="/registration"
                className="text-black px-4 py-2 rounded-lg border-2 border-[#555555] hover:bg-gray-300 transition duration-300 ease-in-out"
              >
                Register
              </Link> */}
              <Link
                to="/login"
                className="bg-[#F28705] text-white px-4 py-2 rounded-lg shadow-lg border-2 border-[#F28705] hover:bg-[#F25C05] transition duration-300 ease-in-out"
              >
                Login
              </Link>
              </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-4 justify-start items-start">
          {['/home', '/announcement', '/gallery', '/about', '/contactus'].map((path) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium text-[#333333] hover:text-[#444444] ${
                location.pathname === path ? 'text-[#444444]' : ''
              }`}
            >
              {path === '/home' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className="flex flex-col space-y-2 items-start">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-300">
                Login
              </Link>
              {/* <Link to="/registration" className="text-sm font-medium text-gray-700 hover:text-gray-300">
                Register
              </Link> */}
            </div>
          )}
        </div>
      )}

      {/* User Menu for Mobile */}
      {isMenuOpen && isLoggedIn && user && (
        <div className="md:hidden mt-4 flex justify-start relative">
          <div className="flex flex-col items-start">
            <button
              onClick={() => toggleDropdown(isDropdownOpen, setIsDropdownOpen, setIsNotificationOpen)}
              className="flex items-center text-sm font-medium text-black"
            >
              <span className="sr-only">Open user menu</span>
              <span className="text-sm font-medium">Profile</span>
              <MdArrowDropDown className="ml-2 w-5 h-5" />
            </button>

            {isDropdownOpen && (
              <div className="relative mt-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => handleLogout(setIsLoggedIn, setUser, navigate)}
                  className="w-full text-left block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
