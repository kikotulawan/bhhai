import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { TailSpin } from 'react-loader-spinner';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitting(true);

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setMessage(response.data.message);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-4 rounded-xl bg-white shadow-lg">
                <h1 className="text-3xl font-bold text-center text-blue-400">Reset Password</h1>
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            readOnly
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {message && <div className="text-green-500">{message}</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center px-4 py-2 text-white rounded-md focus:outline-none ${
                                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600'
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <TailSpin
                                        height="24"
                                        width="24"
                                        color="#ffffff"
                                        ariaLabel="loading"
                                    />
                                    <span className="ml-2">Resetting...</span>
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
