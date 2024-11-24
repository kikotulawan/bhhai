import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import ProgressBar from '../components/ProgressBar';

function HomeOwner_Step2({ formData, setFormData }) {
  const navigate = useNavigate();
  const [emailErrorMessage, setEmailErrorMessage] = useState(''); // Email-specific error state
  const [generalErrorMessage, setGeneralErrorMessage] = useState(''); // General error state
  const [emailAvailable, setEmailAvailable] = useState(true); // State for email availability
  const [emailTouched, setEmailTouched] = useState(false); // Track if email input was touched

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate contact number follows Philippine mobile format
    if (name === 'contact_number') {
      const phonePattern = /^(09|\+639)\d{9}$/;
      if (!phonePattern.test(value)) {
        setGeneralErrorMessage('Contact number should start with 09 or +639 followed by 9 digits.');
      } else {
        setGeneralErrorMessage(''); // Clear error message if valid
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Function to check email availability (triggered on blur)
  const handleEmailBlur = async () => {
    setEmailTouched(true); // Mark the email field as touched

    try {
      const response = await axios.post('/check-email', { email: formData.email });
      if (response.data.message === 'Email is already taken') {
        setEmailAvailable(false);
        setEmailErrorMessage('The email is already taken');
      } else {
        setEmailAvailable(true);
        setEmailErrorMessage(''); // Clear error message if available
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
      setEmailErrorMessage('Error checking email. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent form submission if email is taken or there's another error
    if (!emailAvailable || generalErrorMessage) {
      return;
    }

    try {
      const response = await axios.post(
        '/register/step2',
        {
          email: formData.email,
          contact_number: formData.contact_number,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.message === 'Step 2 completed') {
        setFormData({});
        navigate('/homeowner_step3');
      }
    } catch (error) {
      console.error('Error in step 2 submission:', error);
      if (error.response) {
        if (error.response.data.message === 'The email is already taken') {
          setEmailErrorMessage('The email is already taken');
        } else {
          setGeneralErrorMessage('An error occurred. Please try again.');
        }
      }
    }
  };

  const handlePrevious = () => {
    navigate('/homeowner_step1');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/images/bhhai-logo.png" alt="Logo" className="h-32 w-32 mx-auto" />
          <div className="mt-4">
            <ProgressBar step={2} />
          </div>
        </div>

        {generalErrorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{generalErrorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur} // Check email availability on blur
              className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${emailErrorMessage ? 'border-red-500' : 'focus:border-blue-500'}`}
              placeholder="Email"
              required
            />
            {emailTouched && emailErrorMessage && (
              <p className="text-red-500 text-xs italic mt-1">{emailErrorMessage}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
              Mobile Number
            </label>
            <input
              type="tel"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${generalErrorMessage ? 'border-red-500' : 'focus:border-blue-500'}`}
              placeholder="Mobile Number"
              required
            />
          </div>

          <div className="mb-6 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="w-1/2 mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Previous
            </button>
            <button
              type="submit"
              className="w-1/2 ml-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:bg-amber-600"
              disabled={!emailAvailable || !!generalErrorMessage} // Disable if email is taken or there is a general error
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomeOwner_Step2;
