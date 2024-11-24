import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'flowbite';
import '../../css/app.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 


    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setStatus('');
        setLoading(true);
    
        try {
            const trimmedPassword = password.trim();
    
            await axios.get('/sanctum/csrf-cookie');

            const response = await axios.post('/api/login', {
                email,
                password: trimmedPassword,
                remember,
            });
    
            if (response.status === 200) {
                // Store the token and user type in local storage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usertype', response.data.usertype);

                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }
    
                // Fetch user details to check if it's the first login
                const userResponse = await axios.get('/api/user-profile', {
                    headers: { Authorization: `Bearer ${response.data.token}` },
                });
    
                const user = userResponse.data;
    
                // Redirect based on user type and first login status
                if (response.data.usertype === '1') {
                    // If the user is an admin, navigate to the admin dashboard
                    navigate('/admin-dashboard');
                } else if (user.is_first_login && response.data.usertype !== '1') {
                    // If it's the user's first login and they are not an admin, navigate to change password
                    navigate('/profile/user-account-settings?tab=password', { replace: true });
                } else {
                    // Otherwise, navigate to the home page
                    navigate('/profile/dashboard', { replace: true });
                }
    
                // Clear form data
                setEmail('');
                setPassword('');
            } else {
                setErrors(response.data.errors || ['Incorrect Email or Password.']);
            }
        } catch (error) {
            setLoading(false);
            setErrors(['Incorrect Email or Password.']);
        } finally {
            setLoading(false);
        }
    };
    
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex lg:flex-row flex-col items-center justify-center relative p-4">
        {/* Background Image Overlay */}
        <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-[#FAFAFA]"
            style={{ backgroundImage: 'url(/images/Houses.jpg)' }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Back Arrow Button */}
        <button
            onClick={() => navigate('/home')}
            className="absolute top-4 left-4 text-white text-lg flex items-center hover:text-gray-300 focus:outline-none"
        >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-2xl" />
        </button>

        <div className="flex flex-col items-center">
            {/* Logo and Title */}
            <div className="relative w-full flex justify-center items-center mb-2">
                <img
                    src="/images/bhhai-logo.png"
                    alt="BHHai Logo"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                />
            </div>

            {/* Login Form Container */}
            <div className="relative z-10 w-full max-w-md p-6 md:p-8 lg:p-10 rounded-lg shadow-lg bg-[#FBFCF8] border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] text-center mb-6">
                    Sign in to your account
                </h2>
                {errors.length > 0 && (
                    <div className="text-red-500 mb-4">
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {status && <div className="text-green-600 mb-4">{status}</div>}
                <form method="POST" onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-transparent text-gray-900 placeholder-gray-400"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-transparent text-gray-900 placeholder-gray-400"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-gray-600"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <label htmlFor="remember_me" className="flex items-center text-sm text-gray-700">
                            <input
                                id="remember_me"
                                type="checkbox"
                                name="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 text-orange-600 border-gray-500 rounded focus-outline-none"
                            />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <Link to="/forgot-pass" className="text-sm text-orange-600 hover:text-orange-900">
                            Forgot your password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    </div>
);
};

export default Login;
