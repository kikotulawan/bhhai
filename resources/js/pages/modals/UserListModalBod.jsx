import React, { useState, useRef, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { HiX } from 'react-icons/hi';
import { fetchApprovedUsers } from '../../api/user';

const UserListModalBod = ({ show, onClose, onConfirm, boardMember, loading }) => {
    const [formData, setFormData] = useState({
        position: '',
        start_of_term: '',
        end_of_term: '',
        image: null, 
    });

    const [selectedUser, setSelectedUser] = useState(boardMember?.user_id || null);  
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

    useEffect(() => {
        if (boardMember) {
            setFormData({
                position: boardMember.position,
                start_of_term: boardMember.start_of_term,
                end_of_term: boardMember.end_of_term,
                image: null, 
            });
            setSearchQuery(`${boardMember.user?.firstName} ${boardMember.user?.lastName}`);
        }
    }, [boardMember]);

    const handleSelectUser = (user) => {
        setSelectedUser(user.id);
        setSearchQuery(`${user.firstName} ${user.lastName}`);
        setFilteredUsers([]);
        setDropdownOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
            const maxSizeInBytes = 2 * 1024 * 1024;
    
            if (validTypes.includes(file.type)) {
                if (file.size <= maxSizeInBytes) {
                    setFormData({ ...formData, image: file });  // Store image file directly in formData
                } else {
                    alert('File size exceeds the maximum limit of 2MB.');
                    event.target.value = '';  
                    setFormData({ ...formData, image: null });
                }
            } else {
                alert('Invalid file type. Please select a valid image file (jpeg, png, jpg, gif, svg).');
                event.target.value = '';  
                setFormData({ ...formData, image: null });
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();  
    
        // Check if the end of term is after the start of term
        if (new Date(formData.end_of_term) <= new Date(formData.start_of_term)) {
            alert('End of term must be after the start of term.');
            return;
        }
    
        // Create a new FormData object to submit form data including file
        const form = new FormData();
        form.append('user_id', selectedUser);
        form.append('position', formData.position);
        form.append('start_of_term', formData.start_of_term);
        form.append('end_of_term', formData.end_of_term);
    
        // Append the image file if it exists in formData
        if (formData.image) {  
            form.append('image', formData.image); 
        }

        // Debugging: Log the FormData contents to ensure it's correct
        for (let [key, value] of form.entries()) {
            console.log(key, value);
        }
    
        try {
            await onConfirm(form);  // Call the onConfirm function to handle the form submission
            onClose();  // Close the form/modal after successful submission
        } catch (error) {
            console.error('Error updating board member:', error);
            alert('Failed to update board member. Please try again.');
        }
    };

    return (
        <div className="p-4 fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-6 border w-full max-w-lg mx-auto shadow-lg rounded-md bg-white">
                <div className="relative mb-5">
                    <h3 className="text-xl font-semibold text-gray-900 text-center">Update Board Member</h3>
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    {/* User Search */}
                    <div className="relative mb-4" ref={dropdownRef}>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                            Search Approved Users
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder="Search by name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        {dropdownOpen && filteredUsers.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
                                <ul>
                                    {filteredUsers.map((user) => (
                                        <li
                                            key={user.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            {user.firstName} {user.lastName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Position Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="position">
                            Position
                        </label>
                        <select
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                            required
                        >
                            <option value="">Select Position</option>
                            <option value="President">President</option>
                            <option value="Vice President">Vice President</option>
                            <option value="Secretary">Secretary</option>
                            <option value="Treasurer">Treasurer</option>
                            <option value="Member">Member</option>
                        </select>
                    </div>

                    {/* Start of Term */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="start_of_term">
                            Start of Term
                        </label>
                        <input
                            type="date"
                            id="start_of_term"
                            name="start_of_term"
                            value={formData.start_of_term}
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                            required
                        />
                    </div>

                    {/* End of Term */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="end_of_term">
                            End of Term
                        </label>
                        <input
                            type="date"
                            id="end_of_term"
                            name="end_of_term"
                            value={formData.end_of_term}
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="image">
                            Profile Image (Optional)
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <BeatLoader size={10} color="#fff" />
                                    <span className="ml-2">Updating...</span>
                                </div>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserListModalBod;
