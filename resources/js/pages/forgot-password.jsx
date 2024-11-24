import React, { useState } from 'react';
import axios from '../axiosConfig';
import { TailSpin } from 'react-loader-spinner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitting(true);

        try {
            const response = await axios.post('/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError('Failed to send reset password email. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-4 rounded-xl bg-white shadow-lg">
                <h1 className="text-3xl font-bold text-center text-blue-400">Forgot Password</h1>
                <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                    <span className="ml-2">Sending...</span>
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
