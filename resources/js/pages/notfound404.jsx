import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notfound4page04 = () => {
  const navigate = useNavigate(); 

  const goHome = () => {
    navigate('/home'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="mb-8">
        <img src="/images/404notfound.png" alt="Astronaut" className="w-1/2 mx-auto" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
      Page not found
      </h1>
      <p className="text-gray-500 mb-6">
      Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.
      </p>
      <button
        onClick={goHome}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        Go back home
      </button>
    </div>
  );
};

export default Notfound4page04;
