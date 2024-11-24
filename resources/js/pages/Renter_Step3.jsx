import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

function SignUpForm3({ formData, setFormData }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors({ ...errors, general: '' }); 
    if (name === 'proofOfResidency') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if any of the required fields are missing
    if (!formData.block || !formData.lot || !formData.proofOfResidency || (localStorage.getItem('role') === 'Renter' && !formData.nameOfOwner)) {
      newErrors.general = 'All fields are required.';
    }

    // Check each individual field
    if (!formData.block) newErrors.block = 'This field is required';
    if (!formData.lot) newErrors.lot = 'This field is required';
    if (!formData.proofOfResidency) newErrors.proofOfResidency = 'This field is required';
    if (localStorage.getItem('role') === 'renter' && !formData.nameOfOwner) {
      newErrors.nameOfOwner = 'This field is required for renters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Final data:', formData);

    const formDataToSend = new FormData();
    formDataToSend.append('block', formData.block);
    formDataToSend.append('lot', formData.lot);
    formDataToSend.append('proofOfResidency', formData.proofOfResidency);

    if (localStorage.getItem('role') === 'Renter') {
      formDataToSend.append('nameOfOwner', formData.nameOfOwner);
    }

    formDataToSend.append('role', localStorage.getItem('role'));

    try {
      const response = await fetch('/api/register/step3', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: formDataToSend,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setShowModal(true); 
        setFormData({});
      } else {
        console.error('Submission error', result);
      }
    } catch (error) {
      console.error('Submission error', error);
    }
  };

  const handlePrevious = () => {
    navigate('/renter_step2');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/images/bhhai-logo.png" alt="Logo" className="h-32 w-32 mx-auto" />
          <div className="mt-4">
            <ProgressBar step={3} />
          </div>
        </div>

        {/* Banner-style error message */}
        {errors.general && (
          <div className="bg-red-600 text-white text-center py-2 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="block">
              Block
            </label>
            <input
              type="text"
              id="block"
              name="block"
              value={formData.block}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${errors.block ? 'border-red-500' : 'focus:border-blue-500'}`}
              placeholder="Block"
            />
            {errors.block && <p className="text-red-500 text-xs mt-1">{errors.block}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lot">
              Lot
            </label>
            <input
              type="text"
              id="lot"
              name="lot"
              value={formData.lot}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${errors.lot ? 'border-red-500' : 'focus:border-blue-500'}`}
              placeholder="Lot"
            />
            {errors.lot && <p className="text-red-500 text-xs mt-1">{errors.lot}</p>}
          </div>

          {localStorage.getItem('role') === 'Renter' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nameOfOwner">
                Name Of Owner
              </label>
              <input
                type="text"
                id="nameOfOwner"
                name="nameOfOwner"
                value={formData.nameOfOwner}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${errors.nameOfOwner ? 'border-red-500' : 'focus:border-blue-500'}`}
                placeholder="Name Of Owner"
              />
              {errors.nameOfOwner && <p className="text-red-500 text-xs mt-1">{errors.nameOfOwner}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proofOfResidency">
              Proof Of Residency
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border ${errors.proofOfResidency ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-gray-50 focus:outline-none`}
              id="proofOfResidency"
              type="file"
              name="proofOfResidency"
              onChange={handleChange}
            />
            {errors.proofOfResidency && <p className="text-red-500 text-xs mt-1">{errors.proofOfResidency}</p>}
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
            >
              Confirm
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Thank you for signing up!</h2>
            <svg className="w-10 h-10 text-amber-500 mx-auto mb-4" 
            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"> 
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <p className="text-gray-700 mb-4">
              Your account is being validated. Please wait for confirmation before accessing your account.
            </p>
            <p className="text-gray-700 mb-4">
              A confirmation email will be sent to you shortly, including your password.
            </p>
            <button
              onClick={() => {
                setShowModal(false); 
                navigate('/home'); // Navigate after closing modal
              }}
              className="bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:bg-amber-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUpForm3;
