import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { HiX } from 'react-icons/hi';

const AddUserModal = ({ show, onClose, onConfirm, loading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contact_number: '',
    gender: '',
    block: '',
    lot: '',
    proofOfResidency: null,
    role: '',
  });

  const [fileName, setFileName] = useState('');
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const blockOptions = [...Array(46).keys()].map(i => ({ value: i + 1, label: `Block ${i + 1}` }));
  const lotOptions = [...Array(46).keys()].map(i => ({ value: i + 1, label: `Lot ${i + 1}` }));

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'contact_number') {
      const phonePattern = /^(09|\+639)\d{9}$/;
      setGeneralErrorMessage(
        !phonePattern.test(value) ? 'Contact number should start with 09 or +639 followed by 9 digits.' : ''
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
    setFormData({ ...formData, proofOfResidency: file });
  };

  const handleEmailBlur = async () => {
    try {
      const response = await axios.post('/check-email', { email: formData.email });
      setEmailErrorMessage(response.data.message === 'Email is already taken' ? 'The email is already taken.' : '');
    } catch (error) {
      setEmailErrorMessage('Error checking email. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      contact_number: '',
      gender: '',
      block: '',
      lot: '',
      proofOfResidency: null,
      role: '',
    });
    setFileName('');
    setGeneralErrorMessage('');
    setEmailErrorMessage('');
  };

  const handleSubmit = () => {
    if (generalErrorMessage || emailErrorMessage) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    onConfirm(formDataToSend);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-3xl mx-2 md:mx-4 lg:mx-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add User</h2>
          <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
            <HiX size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" placeholder="First Name" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">Middle Name</label>
            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="input-field" placeholder="Middle Name" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" placeholder="Last Name" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">Mobile Number</label>
            <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="input-field" placeholder="Mobile Number" />
            {generalErrorMessage && <p className="text-red-500 text-sm mt-1">{generalErrorMessage}</p>}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">Block</label>
            <Select name="block" options={blockOptions} onChange={handleSelectChange} value={blockOptions.find(option => option.value === formData.block)} placeholder="Select Block" className="w-full" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">Lot</label>
            <Select name="lot" options={lotOptions} onChange={handleSelectChange} value={lotOptions.find(option => option.value === formData.lot)} placeholder="Select Lot" className="w-full" />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} className="input-field" placeholder="Email" />
            {emailErrorMessage && <p className="text-red-500 text-sm mt-1">{emailErrorMessage}</p>}
          </div>
          <div className="flex flex-col col-span-2">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Gender Radio Buttons */}
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-semibold text-gray-700">Gender</label>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            id="male"
            name="gender"
            value="Male"
            checked={formData.gender === 'Male'}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Male</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            checked={formData.gender === 'Female'}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Female</span>
        </label>
      </div>
    </div>

    {/* Residency Status Radio Buttons */}
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-semibold text-gray-700">Residency Status</label>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            id="homeowner"
            name="role"
            value="Homeowner"
            checked={formData.role === 'Homeowner'}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Homeowner</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            id="renter"
            name="role"
            value="Renter"
            checked={formData.role === 'Renter'}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Renter</span>
        </label>
      </div>
    </div>
  </div>
</div>

          <div className="flex flex-col col-span-2">
            <label className="mb-1 text-sm font-semibold text-gray-700">Proof of Residency</label>
            <label htmlFor="proofOfResidency" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">{fileName || 'SVG, PNG, JPG or GIF (MAX. 800x400px)'}</p>
              </div>
              <input id="proofOfResidency" type="file" name="proofOfResidency" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default AddUserModal;
