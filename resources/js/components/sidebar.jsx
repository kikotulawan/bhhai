import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiCreditCard, HiSpeakerphone, HiBell, HiCog, HiMenu, HiPhotograph } from 'react-icons/hi';
import { MdArrowDropDown } from 'react-icons/md';

const CustomSidebar = ({ isCollapsed: initialIsCollapsed, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState(''); // For handling submenus like User
  const [hoveredMenu, setHoveredMenu] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(initialIsCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  // Sync the sidebar collapse state with the prop
  useEffect(() => {
    setIsSidebarCollapsed(initialIsCollapsed);
  }, [initialIsCollapsed]);

  // Detect window width to handle mobile responsiveness
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // Adjust this value based on your desired mobile width threshold
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle menu for submenu functionality
  const toggleMenu = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? '' : menu));
  };

  const toggleSubmenu = (submenu) => {
    setActiveSubmenu((prevSubmenu) => (prevSubmenu === submenu ? '' : submenu));
  };

  // Hover functionality to show menus
  const handleHover = (menu) => {
    setHoveredMenu(menu);
  };

  const handleHoverLeave = () => {
    setHoveredMenu('');
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-[#F4F4F4]  shadow-md z-40 transition-transform duration-300 ease-in-out transform ${
        isSidebarCollapsed && isMobile ? '-translate-x-full' : 'translate-x-0'
      } ${isMobile ? 'w-64' : isSidebarCollapsed ? 'w-16' : 'w-64'}`}
      style={{ top: '4rem', maxHeight: 'calc(100vh - 4rem)' }}
    >
      {/* Sidebar Toggle Button */}
      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-end'} p-4`}>
        <button
          onClick={() => {
            toggleSidebar();
            setIsSidebarCollapsed((prev) => !prev);
          }}
          className="text-gray-700 hover:bg-gray-200 focus:outline-none shadow-md p-2 rounded"
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="flex flex-col mt-4 space-y-2">
        {/* Dashboard Link */}
        <div
          className="relative group"
          onMouseEnter={() => handleHover('dashboard')}
          onMouseLeave={handleHoverLeave}
        >
          <Link
            to="/admin-dashboard"
            className="flex items-center justify-center md:justify-start px-4 py-2 text-gray-700 hover:bg-[#FFD181] hover:text-white text-base"
          >
            <HiHome className="w-6 h-6" />
            <span className={`ml-4 ${isSidebarCollapsed ? 'hidden' : 'block text-base'}`}>Dashboard</span>
          </Link>
          {hoveredMenu === 'dashboard' && isSidebarCollapsed && (
             <div className="absolute left-16 top-0 transform bg-[#FFD181] text-gray-700 hover:text-white w-48 py-0.94 shadow-lg">
              <Link to="/admin-dashboard" className="block px-4 py-2 hover:bg-[#FFAB41]">
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Payments Section */}
        <div
          className="relative group"
          onMouseEnter={() => handleHover('payments')}
          onMouseLeave={handleHoverLeave}
        >
          <button
            onClick={() => toggleMenu('payments')}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-[#FFD181] hover:text-white text-base"
          >
           <HiCreditCard className="w-6 h-6" />
            <span className={`ml-4 ${isSidebarCollapsed ? 'hidden' : 'block text-base'}`}>Payments</span>
            {!isSidebarCollapsed && (
              <MdArrowDropDown
                className={`ml-auto w-5 h-5 transform transition-transform ${activeMenu === 'payments' ? 'rotate-180' : ''}`}
              />
            )}
          </button>
          {hoveredMenu === 'payments' && isSidebarCollapsed && (
            <div className="absolute left-16 top-0 transform bg-[#FFD181] text-[#242424] w-48 py-2 shadow-lg space-y-1">
              {/* Payment Section */}
              <div className="relative group">
                <span className="block w-full text-left px-4 py-2">
                  Payment
                </span>
                {/* Payment Submenu */}
                <div className="px-2 space-y-1 ">
                  <Link to="/AdminPaymentApproved" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Approved Payments</Link>
                  <Link to="/AdminPaymentProcess" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Pending Payments</Link>
                  <Link to="/AdminPaymentRejected" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Rejected Payments</Link>
                  <Link to="/AdminPaymentDelayed" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Delayed Payments</Link>
                </div>
              </div>
            </div>
          )}

          {!isSidebarCollapsed && activeMenu === 'payments' && (
            <div className="pl-12 space-y-1">
              <Link to="/AdminPaymentApproved" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-sm">
              Approved Payments
              </Link>
              <Link to="/AdminPaymentProcess" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-sm">
              Pending Payments
              </Link>
              <Link to="/AdminPaymentRejected" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-sm">
              Rejected Payments
              </Link>
              <Link to="/AdminPaymentDelayed" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-sm">
              Delayed Payments
              </Link>
            </div>
          )}
        </div>

        {/* Announcements Link */}
        <div
          className="relative group"
          onMouseEnter={() => handleHover('announcements')}
          onMouseLeave={handleHoverLeave}
        >
          <Link
            to="/admin-announcements"
            className="flex items-center justify-center md:justify-start px-4 py-2 text-gray-700 hover:bg-[#FFD181] hover:text-white text-base"
          >
            <HiSpeakerphone className="w-6 h-6" />
            <span className={`ml-4 ${isSidebarCollapsed ? 'hidden' : 'block text-base'}`}>Announcements</span>
          </Link>
          {hoveredMenu === 'announcements' && isSidebarCollapsed && (
            <div className="absolute left-16 top-0 transform bg-[#FFD181] text-gray-700 w-48 py-0.94 shadow-lg">
              <Link to="/admin-announcements" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">
                Announcements
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Link */}
        <div
          className="relative group"
          onMouseEnter={() => handleHover('notification')}
          onMouseLeave={handleHoverLeave}
        >
          <Link
            to="/notification"
            className="flex items-center justify-center md:justify-start px-4 py-2 text-gray-700 hover:bg-[#FFD181] hover:text-white text-base"
          >
            <HiBell className="w-6 h-6" />
            <span className={`ml-4 ${isSidebarCollapsed ? 'hidden' : 'block text-base'}`}>Notification</span>
          </Link>
          {hoveredMenu === 'notification' && isSidebarCollapsed && (
            <div className="absolute left-16 top-0 transform bg-[#FFD181] text-gray-700 w-48 py-0.96 shadow-lg">
              <Link to="/notification" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">
                Notification
              </Link>
            </div>
          )}
        </div>

           {/* Gallery Link */}
           <div
          className="relative group"
          onMouseEnter={() => handleHover('gallery')}
          onMouseLeave={handleHoverLeave}
        >
          <Link
            to="/admin-gallery"
            className="flex items-center justify-center md:justify-start px-4 py-2 text-gray-700 hover:bg-[#FFD181] hover:text-white text-base"
          >
            <HiPhotograph className="w-6 h-6" />
            <span className={`ml-4 ${isSidebarCollapsed ? 'hidden' : 'block text-base'}`}>Gallery</span>
          </Link>
          {hoveredMenu === 'gallery' && isSidebarCollapsed && (
             <div className="absolute left-16 top-0 transform bg-[#FFD181] text-gray-700 hover:text-white w-48 py-0.94 shadow-lg">
              <Link to="/admin-gallery" className="block px-4 py-2 hover:bg-[#FFAB41]">
                Gallery
              </Link>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div
  className="relative group"
  onMouseEnter={() => handleHover('settings')}
  onMouseLeave={handleHoverLeave}
>
  <button
    onClick={() => {
      toggleMenu('settings');
      setActiveSubmenu('');
    }}
    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-[#FFD181] hover:text-white text-base"
  >
    <HiCog className="w-6 h-6" />
    <span className={`ml-4 ${isSidebarCollapsed && !isMobile ? 'hidden' : 'block text-base'}`}>Settings</span>
    {!isSidebarCollapsed && (
      <MdArrowDropDown
        className={`ml-auto w-5 h-5 transform transition-transform ${activeMenu === 'settings' ? 'rotate-180' : ''}`}
      />
    )}
  </button>

  {/* Render submenu when sidebar is not collapsed */}
  {!isSidebarCollapsed && activeMenu === 'settings' && (
    <div className="pl-12 space-y-1">
      <button
        onClick={() => toggleSubmenu('user')}
        className="flex items-center w-full text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base"
      >
        User
        <MdArrowDropDown
          className={`ml-auto w-5 h-5 transform transition-transform ${activeSubmenu === 'user' ? 'rotate-180' : ''}`}
        />
      </button>
      {activeSubmenu === 'user' && (
        <div className="pl-12 space-y-1">
          <Link to="/users" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-sm">User List</Link>
          {/* <Link to="/registrant" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-sm">Applicants</Link> */}
          <Link to="/residentrecords" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-sm">Residents Record</Link>
        </div>
      )}
      <Link to="/board-of-directors" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base">Board of Directors</Link>
      <Link to="/Feedback" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base">Feedback</Link>
      <Link to="/houselist" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base">House List</Link>
      <Link to="/AdminBlockAndLots" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base">Block and Lots</Link>
      <Link to="/AdminSettings" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base">System Settings</Link>
      {/* <Link to="/AdminSpamNotifications" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base">Notification</Link>
      <Link to="/viewSchedules" className="block text-gray-700 hover:bg-[#FFD181] hover:text-white px-4 py-2 text-base">Payment Setup</Link> */}
    </div>
  )}

  {/* Render hovered menu when sidebar is collapsed */}
  {hoveredMenu === 'settings' && isSidebarCollapsed && (
    <div className="absolute left-16 top-0 transform bg-[#FFD181] text-[#242424] w-48 py-2 shadow-lg space-y-1 ">
      <div className="block w-full text-left px-4 py-2">Settings</div>
      <div className="relative group px-2">
        <button className="block w-full text-left px-4 py-2" onClick={() => toggleSubmenu('user')}>
          User
          <MdArrowDropDown
            className={`inline-block ml-2 transform transition-transform ${
              activeSubmenu === 'user' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {activeSubmenu === 'user' && (
          <div className="px-2 space-y-1">
            <Link to="/users" className="block px-4 py-2 bg-[#FFAB41] hover:text-white ">User List</Link>
            {/* <Link to="/registrant" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Applicants</Link> */}
            <Link to="/residentrecords" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Residents Record</Link>
          </div>
        )}
      </div>
      <div className="px-2 space-y-1">
      <Link to="/board-of-directors" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Board of Directors</Link>
      <Link to="/Feedback" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Feedback</Link>
      <Link to="/houselist" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">House List</Link>
      <Link to="/AdminBlockAndLots" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Block and Lots</Link>
      <Link to="/AdminSettings" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">System Settings</Link>
      {/* <Link to="/AdminSpamNotifications" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Notification</Link>
      <Link to="/viewSchedules" className="block px-4 py-2 hover:bg-[#FFAB41] hover:text-white">Payment Setup</Link> */}
      </div>
    </div>
  )}
</div>


      </nav>
    </div>
  );
};

export default CustomSidebar;
