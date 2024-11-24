import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usertype = localStorage.getItem('usertype');

    if (token && (!adminOnly || usertype === '1')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, [adminOnly]);


  useEffect(() => {
    if (!isAuthenticated) {
      window.history.pushState(null, '', window.location.href);
      const preventBackNavigation = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', preventBackNavigation);

      return () => {
        window.removeEventListener('popstate', preventBackNavigation);
      };
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
