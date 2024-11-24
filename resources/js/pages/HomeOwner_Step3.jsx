import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import ProgressBar from '../components/ProgressBar';

function HomeOwner_Step3({ formData, setFormData }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Modal state
  const [errors, setErrors] = useState({}); // Error state

  const blockOptions = [...Array(46).keys()].map(i => ({ value: i + 1, label: `Block ${i + 1}` }));
  const lotOptions = [...Array(46).keys()].map(i => ({ value: i + 1, label: `Lot ${i + 1}` }));

  const handleChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePrevious = () => {
    navigate('/homeowner_step2');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.block) newErrors.block = 'This field is required';
    if (!formData.lot) newErrors.lot = 'This field is required';
    if (!formData.proofOfResidency) newErrors.proofOfResidency = 'This field is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('role', localStorage.getItem('role'));  
  
    try {
      const response = await fetch('/api/register/step3', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: formDataToSend,
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(result));
      }
      console.log(result);
      setShowModal(true);
      setFormData({});
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorDetails = JSON.parse(error.message);
      alert('Submission failed: ' + Object.values(errorDetails).join(', '));
    }
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

        {Object.values(errors).length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">All fields are required.</span>
          </div>
        )}


        <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="block">
              Block
            </label>
            <Select
              options={blockOptions}
              onChange={(option) => handleChange(option, { name: 'block' })}
              value={blockOptions.find(option => option.value === formData.block)}
              placeholder="Select Block"
              className="w-full "
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor="lot">
              Lot
            </label>
            <Select
              options={lotOptions}
              onChange={(option) => handleChange(option, { name: 'lot' })}
              value={lotOptions.find(option => option.value === formData.lot)}
              placeholder="Select Lot"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="proofOfResidency">
              Upload Image
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border ${errors.proofOfResidency ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-gray-50 focus:outline-none`}
              id="proofOfResidency"
              type="file"
              name="proofOfResidency"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleChange(e)}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Accepted documents: Ownership Title, Lease Agreement, Utility Bill
            </p>
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
                navigate('/home');
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

export default HomeOwner_Step3;
