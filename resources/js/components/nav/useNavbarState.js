import { useState, useEffect } from 'react';
import { fetchLoginStatus } from './navbarUtils';

export const useNavbarState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [scrolled, setScrolled] = useState(false);
  const [hasScrolledMargin, setHasScrolledMargin] = useState(false);

  useEffect(() => {
    // Fetch the login status from your backend and set the state accordingly
    fetchLoginStatus(setIsLoggedIn, setUser, setLoading);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setHasScrolledMargin(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return {
    isMenuOpen,
    setIsMenuOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    loading,
    setLoading,
    scrolled,
    hasScrolledMargin,
  };
};
