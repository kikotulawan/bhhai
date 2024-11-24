import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate   } from 'react-router-dom';
import CustomToast from '../components/CustomToast'; // Import your custom toast component
import { submitEmailAndUsername, submitAvatar, submitPassword } from '../api/userservice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import zxcvbn from 'zxcvbn';
import { fetchUserDetails } from '../api/user';

const UserAccountSettings = ({ user = {}, onUserUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'info';

  const [activeTab, setActiveTab] = useState('info');
  const [userDetails, setUserDetails] = useState(user); // Updated state for user details
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [showPasswordChangeMessage, setShowPasswordChangeMessage] = useState(!!user?.is_first_login);
  const currentUrl = `${location.pathname}${location.search}`;
  const targetUrl = "/profile/user-account-settings?tab=password";
  const isMatch = currentUrl === targetUrl;
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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
  
  useEffect(() => {
    if (userDetails && userDetails.is_first_login === 1) {
      if(!isMatch) {
        navigate('/profile/dashboard?refresh=true');
      }
    }
  }, [userDetails?.is_first_login]);

const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
      await submitPassword(
          currentPassword,
          newPassword,
          confirmPassword,
          passwordStrength,
          setIsLoading,
          setMessage,
          setIsError,
          async () => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setPasswordStrength(0);
              setShowPasswordChangeMessage(false);

              // Fetch updated user details and set them to user state
              const updatedUser = await fetchUserDetails();
              setUserDetails(updatedUser); // Update the user state directly
              if (updatedUser.is_first_login === 0) {
                  setToastMessage('Password updated successfully! Feel free to explore.');
                  setToastType('success');
                  onUserUpdate(updatedUser)

                  // Delay for a moment to show the success message, then reload the page
                  // setTimeout(() => {
                  //   console.log(updatedUser)
                  //     navigate('/profile/dashboard') // Refresh the page
                  // }, 1000); // Adjust delay as needed
              }
          }
      );
  } catch (error) {
      console.error('Password update failed:', error);
  } finally {
      setIsLoading(false);
  }
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
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  
  
  const handleTabChange = (tab) => {
    if (user?.is_first_login && tab !== 'password') {
      setToastMessage('Please update your password to keep your account secure.');
      setToastType('error');
      return;
    }
    setActiveTab(tab);
  };


  useEffect(() => {
    if (user?.is_first_login) {
        setToastMessage('Please update your password to keep your account secure.');
        setToastType('error');

        // Redirect to the "Change Password" tab if the password has not been changed
        setActiveTab('password');
    }
}, [user?.is_first_login]); // Only re-run when user changes



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
      
      <div className='bg-[#F3F4F6] rounded-md'>
        <h3 className="text-center text-3xl font-semibold p-2 mb-4">Account Settings</h3>
      </div>

       {/* Show custom toast */}
        {toastMessage && (
          <CustomToast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage('')}
          />
        )}


      <div className="flex justify-evenly mb-6 border-b-2 pb-2">
        <button
          className={`text-lg font-semibold ${activeTab === 'info' ? 'text-blue-600 border-blue-600 border-b-2' : ''}`}
          onClick={() => handleTabChange('info')}
        >
          User Account Info
        </button>
        <button
          className={`text-lg font-semibold ${activeTab === 'avatar' ? 'text-blue-600 border-blue-600 border-b-2' : ''}`}
          onClick={() => handleTabChange('avatar')}
        >
          Change Profile
        </button>
        <button
          className={`text-lg font-semibold ${activeTab === 'password' ? 'text-blue-600 border-blue-600 border-b-2' : ''}`}
          onClick={() => handleTabChange('password')}
        >
          Change Password
        </button>
      </div>

      {/* Rest of your JSX for forms */}
      {activeTab === 'info' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">User Account Info</h3>
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
          <h3 className="text-xl font-semibold mb-4">Change Profile Picture</h3>
          <form onSubmit={handleAvatarSubmit}>
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
          <h3 className="text-xl font-semibold mb-4">Change Password</h3>
          {showPasswordChangeMessage && (
            <div className="mb-4 text-sm text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <span>For security reasons, please change your password on your first login.</span>
            </div>
          )}
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
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex flex-col md:flex-row items-start md:items-center">
                <span className="text-green-500 mr-2">✔️</span>
                <span>At least&nbsp;<strong>8 characters</strong>&nbsp;long (and up to 100 characters)</span>
              </li>
              <li className="flex flex-col md:flex-row items-start md:items-center">
                <span className="text-green-500 mr-2">✔️</span>
                <span>At least&nbsp;<strong>one uppercase</strong>&nbsp;character</span>
              </li>
              <li className="flex flex-col md:flex-row items-start md:items-center">
                <span className="text-green-500 mr-2">✔️</span>
                <span>At least&nbsp;<strong>one lowercase</strong>&nbsp;character</span>
              </li>
              <li className="flex flex-col md:flex-row items-start md:items-center">
                <span className="text-green-500 mr-2">✔️</span>
                <span>At least&nbsp;<strong>one number</strong></span>
              </li>
              <li className="flex flex-col md:flex-row items-start md:items-center">
                <span className="text-green-500 mr-2">✔️</span>
                <span>Inclusion of at least&nbsp;<strong>one special character</strong>, e.g., ! @ # ?</span>
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

export default UserAccountSettings;
