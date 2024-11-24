import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

const UserListModal = ({ show, onClose, onConfirm, title, user, loading }) => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setMiddleName(user.middleName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setRole(user.role || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Map the role to userType
        const updatedUser = {
            firstName,
            middleName,
            lastName,
            email,
            role,
            userType: role === 'Administrator' ? '1' : '0'  // 1 for Administrator, 0 for others
        };

        console.log('Submitting Updated User:', updatedUser); 
        await onConfirm(updatedUser);
        onClose(); 
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative p-6 border w-full max-w-3xl mx-auto shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-xl font-bold leading-6 text-gray-900">{title}</h3>
                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-semibold text-gray-700" htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-semibold text-gray-700" htmlFor="middleName">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Middle Name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-semibold text-gray-700" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-semibold text-gray-700" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="flex flex-col col-span-2">
                                <label className="mb-1 text-sm font-semibold text-gray-700" htmlFor="role">
                                    User Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="">Select a role</option>
                                    <option value="Administrator">Administrator</option> {/* Updated role */}
                                    <option value="Homeowner">Homeowner</option>
                                    <option value="Renter">Renter</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                disabled={loading}
                            >
                                {loading ? <BeatLoader size={10} color="#fff" /> : 'Confirm'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserListModal;
