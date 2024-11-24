import React, { useState, useEffect } from 'react';
import { fetchPendingUsers } from '../api/user';
import axiosInstance from '../axiosConfig'; 
import Modal from './modals/modal';
import AddUserModal from './modals/AddUserModal';
import FilteredResidentTable from './FilteredResidentTable'; 
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';
import Breadcrumbs from '../components/Breadcrumbs';
import {useLocation } from 'react-router-dom';

const UsersTable = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(true); 
    const location = useLocation(); 
    const crumbs = getBreadcrumbs(location);


    useEffect(() => {
        const getPendingUsers = async () => {
            try {
                const users = await fetchPendingUsers();
                setPendingUsers(users);
            } catch (error) {
                console.error('Failed to fetch pending users:', error);
                setError('Failed to load users. Please try again later.');
            }
        };

        getPendingUsers();
    }, []);

    const handleModalAction = (action, userId, title, message) => {
        setModalContent({
            title,
            message,
            confirmAction: () => action(userId),
        });
        setIsModalOpen(true);
    };

    const handleApprove = (userId) => {
        handleModalAction(approveUser, userId, 'Approve User', 'Are you sure you want to approve this user?');
    };

    const handleReject = (userId) => {
        handleModalAction(rejectUser, userId, 'Reject User', 'Are you sure you want to reject this user?');
    };

   
    const approveUser = async (userId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/users/approve/${userId}`);
            if (response.status === 200) {
                setMessage('User approved successfully.');
                setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                setError('');
                setIsModalOpen(false);
            } else {
                setError('Failed to approve user. Unexpected response status.');
            }
        } catch (error) {
            console.error('Error approving user:', error);
            setError('Failed to approve user. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const rejectUser = async (userId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/users/reject/${userId}`);
            if (response.status === 200) {
                setMessage('User rejected and deleted successfully.');
                setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                setError('');
                setIsModalOpen(false);
            } else {
                setError('Failed to reject user. Unexpected response status.');
            }
        } catch (error) {
            console.error('Error rejecting user:', error);
            setError('Failed to reject user. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (formData) => {
        setValidationErrors({});
        try {
            const response = await axiosInstance.post('/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPendingUsers([...pendingUsers, response.data]);
            setShowAddModal(false);
            setMessage('User added successfully.');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setValidationErrors(error.response.data.errors);
                    setError('Validation failed. Please check your input.');
                } else {
                    setError('Failed to add user. Please try again later.');
                }
            } else {
                setError(`Failed to add user: ${error.message}`);
            }
        }
    };

    const handleCloseMessage = () => {
        setShowMessage(false); // Hide the message
    };

    return (
        <div className="min-h-screen p-4 bg-[#FAFAFA]">
            {/* Message Display */}
        {showMessage && message && (
          <div className="bg-green-500 text-white p-2 rounded-md mb-4 relative">
            {message}
            <button
              onClick={handleCloseMessage}
              className="absolute top-2 right-3 text-white hover:text-gray-200"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}

        {showMessage && error && (
          <div className="bg-red-500 text-white p-2 rounded-md mb-4 relative">
            {error}
            <button
              onClick={handleCloseMessage}
              className="absolute top-2 right-3 text-white hover:text-gray-200"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}

            {/* BreadCrumbs Section */}
            <div className="bg-slate-200 rounded-md mb-2  ">
             <Breadcrumbs crumbs={crumbs} />
            </div>

            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={modalContent.confirmAction}
                title={modalContent.title}
                loading={loading}
            >
                <p>{modalContent.message}</p>
            </Modal>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Left Section: UsersTable */}
                <div className="w-full md:w-1/2 bg-white rounded-md shadow-sm p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-poppins font-semibold mb-4">Applicants List</h2>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 flex items-center text-sm"
                        >
                            <svg className="w-5 h-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                            </svg>
                            Add User
                        </button>
                    </div>
                    <div className="overflow-x-auto border-y border-gray-300 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">FullName</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Mobile Number</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Gender</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Block</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Lot</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Proof of Residency</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Residential Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingUsers.length > 0 ? (
                                    pendingUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        {`${user.firstName} ${user.middleName || ""} ${user.middleInitial || ""} ${user.lastName}`.trim()}
                                        </td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.contact_number}</td>
                                        <td className="px-6 py-4">{user.gender}</td>
                                        <td className="px-6 py-4">{user.block}</td>
                                        <td className="px-6 py-4">{user.lot}</td>
                                        <td className="px-6 py-4">
                                        <a
                                            href={`/storage/${user.proofOfResidency}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </a>
                                        </td>
                                        <td className="px-6 py-4">{user.role === 'Homeowner' ? 'Homeowner' : 'Renter'}</td>
                                        <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                            onClick={() => handleApprove(user.id)}
                                            className="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800"
                                            >
                                            Approve
                                            </button>
                                            <button
                                            onClick={() => handleReject(user.id)}
                                            className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                                            >
                                            Reject
                                            </button>
                                        </div>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan="11" className="text-center text-gray-500 py-4">
                                        No registrants for the meantime.
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                        </table>
                    </div>
                    <AddUserModal
                        show={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onConfirm={handleAddUser}
                    />
                </div>

                <div className="w-full md:w-1/2 bg-white rounded-md shadow-sm p-4 border border-gray-200">
                    <h2 className="text-2xl font-poppins font-semibold mb-4">Records</h2>
                    <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                        <FilteredResidentTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;
