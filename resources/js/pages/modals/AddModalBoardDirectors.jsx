import React, { useState, useRef, useEffect } from 'react';
import { fetchApprovedUsers } from '../../api/user';

const AddModalBoardDirectors = ({ show, onClose, onConfirm, loading }) => {
    const [selectedPosition, setSelectedPosition] = useState('');
    const [startOfTerm, setStartOfTerm] = useState('');
    const [endOfTerm, setEndOfTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch users based on search query
    useEffect(() => {
        const loadUsers = async () => {
            if (searchQuery) {
                const users = await fetchApprovedUsers(searchQuery);
                setFilteredUsers(users);
                setDropdownOpen(true);
            } else {
                setFilteredUsers([]);
                setDropdownOpen(false);
            }
        };

        loadUsers();
    }, [searchQuery]);

    // Handle outside click to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery(`${user.firstName} ${user.lastName}`);
        setFilteredUsers([]);
        setDropdownOpen(false);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('user_id', selectedUser?.id);
        formData.append('position', selectedPosition);
        formData.append('start_of_term', startOfTerm);
        formData.append('end_of_term', endOfTerm);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        onConfirm(formData);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Add Board Member</h2>

                {/* Search for Users */}
                <div className="relative mb-4" ref={dropdownRef}>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        Search Approved Users
                    </label>
                    <div className="relative flex items-center">
                        <input
                            id="search"
                            type="text"
                            placeholder="Search approved users"
                            className="form-input w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg"
                            value={searchQuery}
                            autoComplete="off"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg
                            className="absolute inset-y-0 left-3 w-6 h-6 text-gray-800 flex items-center justify-center mt-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="gray"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    {dropdownOpen && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
                            <ul>
                                {filteredUsers.map(user => (
                                    <li
                                        key={user.id}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        {`${user.firstName || ''} ${user.lastName}`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Position Dropdown */}
                <div className="mb-4">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                    <select
                        id="position"
                        className="form-select w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                    >
                        <option value="">Select Position</option>
                        <option value="President">President</option>
                        <option value="Vice President">Vice President</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Treasurer">Treasurer</option>
                        <option value="Auditor">Auditor</option>
                        <option value="Member">Member</option>
                    </select>
                </div>

                {/* Term Dates */}
                <div className="mb-4">
                    <label htmlFor="startOfTerm" className="block text-sm font-medium text-gray-700">Start of Term</label>
                    <input
                        type="date"
                        id="startOfTerm"
                        className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={startOfTerm}
                        onChange={(e) => setStartOfTerm(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="endOfTerm" className="block text-sm font-medium text-gray-700">End of Term</label>
                    <input
                        type="date"
                        id="endOfTerm"
                        className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={endOfTerm}
                        onChange={(e) => setEndOfTerm(e.target.value)}
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {loading ? 'Adding...' : 'Add to Board'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddModalBoardDirectors;
