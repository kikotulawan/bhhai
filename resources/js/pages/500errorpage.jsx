import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error500Page = () => {
  const navigate = useNavigate(); 

  const goHome = () => {
      const usertype = localStorage.getItem('usertype');

    if (usertype === '1') {
        navigate('/admin-dashboard');  
    } else {
        navigate('/home'); 
    }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="mb-8">
        <img src="/images/500errorpage.png" alt="Astronaut" className="w-1/2 mx-auto" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Something has gone seriously wrong
      </h1>
      <p className="text-gray-500 mb-6">
        It's always time for a coffee break. We should be back by the time you finish your coffee.
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

export default Error500Page;
