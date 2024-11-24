import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useLocation } from 'react-router-dom';
import UserListModal from './modals/UserListModal';
import DeleteModal from './modals/DeleteModal';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/pagination';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Toast from '../components/Toast';



const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState(''); // New role filter state
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation(); 
    const crumbs = getBreadcrumbs(location);

    useEffect(() => {
        axiosInstance.get('/users/approved')
            .then(response => {
                setUsers(response.data);
                setFilteredUsers(response.data);
                setError('');
            })
            .catch(error => {
                console.error('Error fetching approved users:', error);
                setError('Failed to load approved users. Please try again later.');
            });
    }, []);

    useEffect(() => {
        let filtered = users;

        
        if (searchQuery) {
            filtered = filtered.filter(user =>
                `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter based on role (Homeowner or Renter)
        if (roleFilter) {
            filtered = filtered.filter(user => user.role.toLowerCase() === roleFilter.toLowerCase());
        }

        setFilteredUsers(filtered);
    }, [searchQuery, roleFilter, users]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    const handleEntriesPerPageChange = (event) => {
        setEntriesPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when changing entries per page
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleUpdate = (user) => {
        setModalTitle('Update User');
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    const handleDelete = (user) => {
        setModalTitle('Delete User');
        setModalContent('Are you sure you want to delete this user?');
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleConfirmUpdate = async (updatedUser) => {
        console.log('Updated User:', updatedUser);
        setLoading(true);
        try {
          const response = await axiosInstance.put(`/users/${selectedUser.id}`, updatedUser, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          // Update user lists
          setUsers(users.map(user => (user.id === selectedUser.id ? response.data : user)));
          setFilteredUsers(filteredUsers.map(user => (user.id === selectedUser.id ? response.data : user)));
      
          // Close the update modal
          setShowUpdateModal(false);
      
          // Show success toast
          setSuccessMessage('User successfully updated!');
          setShowToast(true);
      
          // Hide the toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } catch (error) {
          console.error('Error updating user:', error.response?.data || error.message);
          setError('Failed to update user. Please try again later.');
      
          // Show error toast
          setSuccessMessage('Failed to update user.');
          setShowToast(true);
      
          // Hide the toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } finally {
          setLoading(false);
        }
      };
      const handleConfirmDelete = async () => {
        setLoading(true);
        try {
          await axiosInstance.delete(`/users/${selectedUser.id}`);
      
          // Update user lists
          setUsers(users.filter(user => user.id !== selectedUser.id));
          setFilteredUsers(filteredUsers.filter(user => user.id !== selectedUser.id));
      
          // Close the delete modal
          setShowDeleteModal(false);
      
          // Show success toast
          setSuccessMessage('User successfully deleted!');
          setShowToast(true);
      
          // Hide the toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } catch (error) {
          console.error('Error deleting user:', error);
          setError('Failed to delete user. Please try again later.');
      
          // Show error toast
          setSuccessMessage('Failed to delete user.');
          setShowToast(true);
      
          // Hide the toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } finally {
          setLoading(false);
        }
      };

    // Pagination setup
    const indexOfLastUser = currentPage * entriesPerPage;
    const indexOfFirstUser = indexOfLastUser - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);

    return (
        <div className=" min-h-screen relative overflow-x-auto shadow-md sm:rounded-md p-4 bg-[#FAFAFA]">

                    {showToast && (
                    <Toast
                        message={successMessage}
                        type={successMessage.includes('Failed') ? 'danger' : 'success'}
                        onClose={() => setShowToast(false)}
                    />
                    )}

            {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}

            <div className="bg-slate-200 rounded-md mb-2">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            {/* Controls Section */}
            <div className="mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        <div className="relative flex-grow">
                            <svg
                            className="absolute left-3 top-2.5 w-5 h-5 text-gray-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                            </svg>
                            <input
                            type="text"
                            placeholder="Search Residents"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="form-input w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Role Filter Dropdown */}
                        <div className="flex items-center">
                            <label htmlFor="roleFilter" className="mr-2">Filter by Role:</label>
                            <select 
                                id="roleFilter" 
                                value={roleFilter} 
                                onChange={handleRoleFilterChange} 
                                className="form-select border border-gray-300 rounded">
                                <option value="">All</option>
                                <option value="Administrator">Administrator</option>
                                <option value="Homeowner">Homeowner</option>
                                <option value="Renter">Renter</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="entries" className="mr-2">Show</label>
                            <select id="entries" 
                            value={entriesPerPage} 
                            onChange={handleEntriesPerPageChange} 
                            className="form-select border border-gray-300 rounded">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="ml-2">entries</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto border-y border-gray-300 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#F4F4F4]">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Role</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map(user => (
                        <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{`${user.firstName} ${user.middleName || ""} ${user.middleInitial || ""} ${user.lastName}`.trim()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-2">
                            <button
                                onClick={() => handleUpdate(user)}
                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-xs sm:text-base flex items-center transition duration-150 ease-in-out"
                            >
                                <FaEdit className="mr-1" />
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(user)}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 text-xs sm:text-base flex items-center transition duration-150 ease-in-out"
                            >
                                <FaTrash className="mr-1" />
                                Delete
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>


            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />

            {/* Modals */}
            <UserListModal
                  show={showUpdateModal}
                  onClose={() => setShowUpdateModal(false)}
                  onConfirm={handleConfirmUpdate}
                  title={modalTitle}
                  user={selectedUser} 
                  loading={loading}
            />
            <DeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                loading={loading}
                title={modalTitle}
                content={modalContent}
            />
        </div>
    );



};


export default UserList;
