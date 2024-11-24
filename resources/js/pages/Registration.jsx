import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Registration() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        navigate('/home'); 
    }
}, [navigate]);

  const handleRoleSelection = (role) => {
    localStorage.setItem('role', role);
    if (role === 'Homeowner') {
      navigate('/homeowner_step1');
    } else {
      navigate('/renter_step1');
    }
    
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA] p-4">

            <button
                onClick={() => navigate('/home')}
                className="absolute top-6 left-6 flex items-center text-gray-800 font-medium px-4 py-2 rounded-lg shadow-lg hover:text-gray-900  transition duration-300"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            </button>

      <div className="text-center p-8 bg-white rounded-md shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-semibold font-poppins text-gray-800 mb-8">Choose Your Residential Status</h1>
        <div className="flex flex-col lg:flex-row justify-around gap-6">
          <div
            className="bg-white p-6 rounded-lg shadow-md w-full sm:w-80 md:w-96 lg:w-1/2 hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => handleRoleSelection('Homeowner')}
          >
            <div className="transition-transform duration-300 transform hover:scale-105">
              <img src="/images/homeowner.jpg" alt="Homeowner" className="mx-auto mb-4 h-40 w-40 rounded-full border-4 border-gray-200" />
              <h2 className="text-2xl font-semibold font-poppins text-gray-800 mb-4">
                <span className="block text-amber-500">Homeowner</span>
              </h2>
            </div>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-80 md:w-96 lg:w-1/2 hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => handleRoleSelection('Renter')}
          >
            <div className="transition-transform duration-300 transform hover:scale-105">
              <img src="/images/renter.jpg" alt="Renter" className="mx-auto mb-4 h-40 w-40 rounded-full border-4 border-gray-200" />
              <h2 className="text-2xl font-semibold font-poppins text-gray-800 mb-4">
                <span className="block text-amber-500">Renter</span>
              </h2>
            </div>
          </div>
        </div>
        <p className="mt-6 text-gray-700">
          Already have an Account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default Registration;
