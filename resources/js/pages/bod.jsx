import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import {useLocation } from 'react-router-dom';
import { addBoardMember, updateBoardMember, deleteBoardMember } from '../api/user';
import AddModalBoardDirectors from './modals/AddModalBoardDirectors';
import UserListModalBod from './modals/UserListModalBod';
import MemberDetailsModal from './modals/MemberDetailsModal';
import DeleteModal from './modals/DeleteModalBod'; 
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/pagination';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';
import { FaEdit, FaTrash,FaEye } from 'react-icons/fa';
import Toast from '../components/Toast';

const BoardOfDirectors = () => {
    const [boardMembers, setBoardMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
    const [selectedMember, setSelectedMember] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null); // Track member to delete
    const [error, setError] = useState('');
    const location = useLocation(); 
    const crumbs = getBreadcrumbs(location);

    // Define the position order for sorting
    const positionOrder = {
        "President": 1,
        "Vice President": 2,
        "Secretary": 3,
        "Treasurer": 4,
        "Auditor": 5,
        "Member": 6,
    };

    // Fetch board members
    useEffect(() => {
        loadBoardMembers();
    }, []);

    const loadBoardMembers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/board-members');
            const sortedBoardMembers = response.data.sort(
                (a, b) => positionOrder[a.position] - positionOrder[b.position]
            );
            setBoardMembers(sortedBoardMembers);
            setFilteredMembers(sortedBoardMembers); // Initialize filtered members
        } catch (error) {
            setError('Failed to load board members. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToBoard = async (formData) => {
        setLoading(true);
        try {
          const response = await addBoardMember(formData);
          const newMember = response?.data;
      
          if (newMember && newMember.user) {
            const updatedBoardMembers = [...boardMembers, newMember];
            const sortedUpdatedMembers = updatedBoardMembers.sort(
              (a, b) => positionOrder[a.position] - positionOrder[b.position]
            );
            setBoardMembers(sortedUpdatedMembers);
            setFilteredMembers(sortedUpdatedMembers); // Update the filtered list
      
            // Show success toast
            setSuccessMessage('Board member successfully added!');
            setShowToast(true);
      
            // Hide the toast after 3 seconds
            setTimeout(() => {
              setShowToast(false);
              setSuccessMessage('');
            }, 3000);
          } else {
            setError('Failed to retrieve user information.');
          }
      
          setIsModalOpen(false);
        } catch (error) {
          setError('Failed to add board member. Please try again later.');
      
          // Show error toast
          setSuccessMessage('Failed to add board member.');
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
      

    const handleViewMember = (member) => {
        setSelectedMember(member);
        setIsViewModalOpen(true);
    };

    const handleUpdateBoardMember = async (id, formData) => {
        setLoading(true);
        try {
          await updateBoardMember(id, formData);
          await loadBoardMembers(); // Reload the updated list of board members
          setIsUpdateModalOpen(false); // Close the update modal
      
          // Show success toast
          setSuccessMessage('Board member successfully updated!');
          setShowToast(true);
      
          // Hide the toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } catch (error) {
          
          if (error.response && error.response.data) {
            console.error('Validation errors:', error.response.data.errors);
            setSuccessMessage('Failed to update board member. Please check the inputs.');
          } else {
            console.error('Error updating board member:', error);
            setSuccessMessage('Error updating board member. Please try again later.');
          }
        
          setShowToast(true);
    
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } finally {
          setLoading(false);
        }
      };

    // Open Delete Confirmation Modal
    const confirmDeleteBoardMember = (member) => {
        setMemberToDelete(member); // Set the member to delete
        setIsDeleteModalOpen(true); // Open delete modal
    };

    // Handle confirmed deletion
    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
          await deleteBoardMember(memberToDelete.id); // Delete the selected member
      
          // Update the board members list
          const updatedBoardMembers = boardMembers.filter(
            (member) => member.id !== memberToDelete.id
          );
          setBoardMembers(updatedBoardMembers);
          setFilteredMembers(updatedBoardMembers); // Update filtered list
      
          // Show success toast
          setSuccessMessage('Board member successfully deleted!');
          setShowToast(true);
      
          // Hide the toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } catch (error) {
          setError('Failed to delete board member. Please try again later.');
      
          // Show error toast
          setSuccessMessage('Failed to delete board member.');
          setShowToast(true);
      
          // Hide the toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
            setSuccessMessage('');
          }, 3000);
        } finally {
          setLoading(false);
          setIsDeleteModalOpen(false); // Close the modal after deletion
        }
      };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            setFilteredMembers(boardMembers); // Reset to full list if search is cleared
        } else {
            const filtered = boardMembers.filter((member) =>
                member.user?.firstName?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                member.user?.lastName?.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredMembers(filtered);
        }
        setCurrentPage(1); // Reset to first page on search
    };

    const handleEntriesChange = (e) => {
        setEntriesPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page on change
    };

    const indexOfLastMember = currentPage * entriesPerPage;
    const indexOfFirstMember = indexOfLastMember - entriesPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(filteredMembers.length / entriesPerPage);

    return (
        <div className="min-h-screen relative overflow-x-auto p-4 bg-[#FAFAFA]">

             {/*Toast */}
               {showToast && (
                <Toast
                    message={successMessage}
                    type={successMessage.includes('Failed') ? 'danger' : 'success'}
                    onClose={() => setShowToast(false)}
                />
                )}

            {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}

          {/* BreadCrumbs Section */}
          <div className="bg-slate-200 rounded-md mb-2">
            <Breadcrumbs crumbs={crumbs} />
          </div>
            {/* Controls Section */}
            
            <div className="mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search Board Members"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="form-input w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="entries" className="mr-2">Show</label>
                            <select
                                id="entries"
                                value={entriesPerPage}
                                onChange={handleEntriesChange}
                                className="form-select border border-gray-300 rounded"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="ml-2">entries</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-700 text-white px-4 py-2  rounded hover:bg-green-800 flex items-center"
                    >
                        Add Board Member
                    </button>
                </div>
            </div>

            {/* Board Members Table */}
            <div className="overflow-x-auto border-y border-gray-300 shadow-sm">
                <table className="table-auto min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-medium border-b border-gray-300">
                            <th className="px-6 py-3 text-center">Avatar</th>
                            <th className="px-6 py-3 text-center">Full Name</th>
                            <th className="px-6 py-3 text-center">Position</th>
                            <th className="px-6 py-3 text-center">Term</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMembers.length > 0 ? (
                            currentMembers.map((member, index) => (
                                <tr key={index} className="border-b border-gray-200 text-center">
                                    <td className="px-6 py-4">
                                        <img
                                            src={`/storage/${member.image || 'board_members/default-avatar.png'}`}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unknown User'}
                                    </td>
                                    <td className="px-6 py-4">{member.position}</td>
                                    <td className="px-6 py-4">{member.start_of_term} - {member.end_of_term}</td>
                                    <td className="px-6 py-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <button
                                            className="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800 text-xs sm:text-base flex items-center"
                                            onClick={() => handleViewMember(member)}
                                        >
                                            <FaEye className="mr-1" /> 
                                            View
                                        </button>
                                        <button
                                            className="bg-[#1D4ED8] text-white p-2 rounded hover:bg-blue-800 text-xs sm:text-base flex items-center"
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setIsUpdateModalOpen(true);
                                            }}
                                            
                                        >
                                            <FaEdit className="mr-1" /> 
                                            Update
                                        </button>
                                        <button
                                             className="bg-[#C81E1E] text-white p-2 rounded hover:bg-red-800 text-xs sm:text-base flex items-center"
                                            onClick={() => confirmDeleteBoardMember(member)} // Open delete modal
                                        >
                                            <FaTrash className="mr-1" /> 
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">No board members found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={setCurrentPage}
            />

            {/* Add Member Modal */}
            {isModalOpen && (
                <AddModalBoardDirectors
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleAddToBoard}
                    loading={loading}
                />
            )}

            {/* Update Member Modal */}
            {isUpdateModalOpen && selectedMember && (
                <UserListModalBod
                    show={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onConfirm={(formData) => handleUpdateBoardMember(selectedMember.id, formData)}
                    loading={loading}
                    boardMember={selectedMember} 
                />
)}

            {/* View Member Modal */}
            {isViewModalOpen && selectedMember && (
                <MemberDetailsModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    member={selectedMember}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && memberToDelete && (
                <DeleteModal
                    show={isDeleteModalOpen}
                    title="Delete Board Member"
                    content={`Are you sure you want to delete ${memberToDelete?.user?.firstName} ${memberToDelete?.user?.lastName}?`}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    loading={loading}
                />
            )}
        </div>
    );
};



export default BoardOfDirectors;
