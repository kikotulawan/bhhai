import React, { useState } from 'react';
import { submitEmailAndUsername, submitAvatar, submitPassword } from '../api/userservice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import zxcvbn from 'zxcvbn';

const AccountSettings = ({ user = {}, onAvatarUpdate }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);  
  const [message, setMessage] = useState(''); 
  const [isError, setIsError] = useState(false);
  const [file, setFile] = useState(null); 
  const [preview, setPreview] = useState(null); // Added state for image preview
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // State for toggling password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEmailAndUsername(
      user.id, 
      username, 
      email, 
      user.username, 
      user.email, 
      setIsLoading, 
      setMessage, 
      setIsError
    );
  };

  const handleAvatarSubmit = (e) => {
    e.preventDefault();
    submitAvatar(user.id, file, setIsLoading, setMessage, setIsError);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl); // Update preview URL
    } else {
      setPreview(null); // Clear preview if no file is selected
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    submitPassword(
      currentPassword, 
      newPassword, 
      confirmPassword, 
      passwordStrength, 
      setIsLoading, 
      setMessage, 
      setIsError, 
      () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength(0);
      }
    );
  };

  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    const strength = zxcvbn(password).score;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Too weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Moderate';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'text-red-500';
      case 2:
        return 'text-yellow-500';
      case 3:
        return 'text-green-500';
      case 4:
        return 'text-blue-500';
      default:
        return '';
    }
  };
  return (
    <div>

        <h3 className="text-center text-gray-800 text-3xl font-semibold font-sans p-2 mb-4">Account Settings</h3>

      
      <div className="flex justify-evenly mb-6 border-b-2 pb-2 text-gray-800">
        <button
          className={`text-lg font-semibold font-sans ${activeTab === 'info' ? 'text-orange-600 border-orange-600 border-b-2' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          User Account Info
        </button>
        <button
          className={`text-lg font-semibold font-sans ${activeTab === 'avatar' ? 'text-orange-600 border-orange-600 border-b-2' : ''}`}
          onClick={() => setActiveTab('avatar')}
        >
          Change Profile
        </button>
        <button
          className={`text-lg font-semibold font-sans ${activeTab === 'password' ? 'text-orange-600 border-orange-600 border-b-2' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>

            {activeTab === 'info' && (
              <div>
                <h3 className="text-xl font-semibold mb-4  font-sans">User Account Info</h3>
                <form onSubmit={handleSubmit}>
                  {message && (
                    <div className={`mb-4 text-sm px-4 py-2 rounded relative ${isError ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}`}>
                      <span>{message}</span>
                      <button
                        onClick={() => setMessage('')}
                        className="absolute top-1 right-0 mr-3 text-lg font-bold text-gray-700 hover:text-gray-900"
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border p-2 w-full rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border p-2 w-full rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`bg-[#1D4ED8] text-white px-4 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-blue-800'}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

          {activeTab === 'avatar' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 font-sans">Change Profile Picture</h3>
                    <form onSubmit={handleAvatarSubmit}>
                      {message && (
                        <div className={`mb-4 text-sm px-4 py-2 rounded relative ${isError ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}`}>
                          <span>{message}</span>
                          <button
                            onClick={() => setMessage('')}
                            className="absolute top-1 right-0 mr-3 text-lg font-bold text-gray-700 hover:text-gray-900">
                            &times;
                          </button>
                        </div>
                      )}
                      
                      {/* Image Preview Section */}
                      {preview && (
                        <div className="mb-4">
                          <img src={preview} alt="Image Preview" className="w-40 h-40 rounded-md object-cover" />
                        </div>
                      )}
                      
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="border p-2 w-full rounded-md"
                        accept="image/*"
                      />

                      <button
                        type="submit"
                        className="mt-4 bg-[#1D4ED8] text-white px-4 py-2 rounded hover:bg-blue-800"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Uploading...' : 'Submit'}
                      </button>
                    </form>
                  </div>
                )}

              {activeTab === 'password' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 font-sans">Change Password</h3>
                  <form onSubmit={handlePasswordSubmit}>
                    {message && (
                      <div className={`mb-4 text-sm px-4 py-2 rounded relative ${isError ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}`}>
                        <span>{message}</span>
                        <button
                          onClick={() => setMessage('')}
                          className="absolute top-1 right-0 mr-3 text-lg font-bold text-gray-700 hover:text-gray-900"
                        >
                          &times;
                        </button>
                      </div>
                    )}

                    <div className="mb-4 text-sm text-gray-500">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                          Password requirements:
                        </h2>
                        <ul className="max-w-md space-y-2 text-gray-600 dark:text-gray-400">
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✔️</span>
                            At least&nbsp;<strong>8 characters</strong>&nbsp;long (and up to 100 characters)
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✔️</span>
                            At least&nbsp;<strong>one uppercase</strong>&nbsp;character
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✔️</span>
                            At least&nbsp;<strong>one lowercase</strong>&nbsp;character
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✔️</span>
                            At least&nbsp;<strong>one number</strong>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✔️</span>
                            Inclusion of at least&nbsp;<strong>one special character</strong>&nbsp;, e.g., ! @ # ?
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium">Current Password</label>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border p-2 w-full rounded-md"
                      />
                      <FontAwesomeIcon
                        icon={showCurrentPassword ? faEyeSlash : faEye}
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-8 cursor-pointer text-gray-600"
                      />
                    </div>

                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium">New Password</label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        className="border p-2 w-full rounded-md"
                      />
                      <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-8 cursor-pointer text-gray-600"
                      />
                      {newPassword && (
                        <div className={`mt-2 text-sm ${getPasswordStrengthColor()}`}>
                          {getPasswordStrengthLabel()}
                        </div>
                      )}
                    </div>

                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium">Confirm New Password</label>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border p-2 w-full rounded-md"
                      />
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-8 cursor-pointer text-gray-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#1D4ED8] text-white px-4 py-2 rounded hover:bg-blue-800"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        };

export default AccountSettings;
