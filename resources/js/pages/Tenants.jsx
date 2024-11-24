import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from "../api/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TenantsList = () => {
    const [tenants, setTenants] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState({});
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState(null);
    const [tenantForm, setTenantForm] = useState({
        id: null,
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        contactNumber: '',
    });

    // Fetch tenants from the API
    const fetchTenants = async (userId) => {
        try {
            const response = await fetch(`/api/user/tenants/${userId}?page=${currentPage}&search=${search}`);
            const data = await response.json();
            setTenants(data.data); // Assuming 'data' contains the tenants' information
            setTotalPages(data.last_page); // Set the total pages for pagination
        } catch (error) {
            console.error('Error fetching tenants:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            const data = await fetchUserDetails();
            if (data && data.id) {
                setUser(data)
                setUserId(data.id);
                fetchTenants(data.id);
            } else {
                toast.error("Fetched user data does not include an ID");
            }
        } catch (err) {
            toast.error("Error fetching user details");
        }
    };

    // Fetch tenants when the component loads, or when the search term or page changes
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchTenants(userId);
        }
    }, [search, currentPage, userId]);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenantForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submit (Add or Update tenant)
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!tenantForm.firstName || !tenantForm.lastName || !tenantForm.email || !tenantForm.contactNumber) {
            toast.error("Please fill in all required fields!");
            return;
        }
        setShowLoader(true)
        try {
            const method = tenantForm.id ? 'PUT' : 'POST';
            const url = tenantForm.id ? `/api/user/tenants/${tenantForm.id}` : '/api/user/tenants/new';
            
            const tenantData = {
                firstName: tenantForm.firstName,
                middleName: tenantForm.middleName,
                lastName: tenantForm.lastName,
                email: tenantForm.email,
                contactNumber: tenantForm.contactNumber,
            };

            if(method == 'POST') {
                tenantData['username'] = (`${tenantForm.firstName}${user.block}${user.lot}`).toLowerCase()
                tenantData['block'] = user.block
                tenantData['lot'] = user.lot
                tenantData['nameOfOwner'] = `${user.firstName} ${user.lastName}`
                tenantData['family_id'] = user.family_id
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tenantData),
            });

            if (response.ok) {
                toast.success(`${tenantForm.id ? 'Updated' : 'Added'} tenant successfully!`);
                fetchTenants(userId); // Refresh tenant list
                setIsModalOpen(false); // Close the modal
                setTenantForm({ id: null, firstName: '', middleName: '', lastName: '', email: '', contactNumber: '' }); // Reset form
            } else {
                toast.error("Error saving tenant");
            }
        } catch (error) {
            toast.error("Error saving tenant");
            console.error(error);
        } finally {
            setShowLoader(false)
        }
    };


    // Delete tenant handler
    const deleteTenant = async () => {
        try {
            const response = await fetch(`/api/user/tenants/${tenantToDelete.id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchTenants(userId);
            } else {
                toast.error(data.message || "Failed to delete tenant");
            }
        } catch (error) {
            toast.error("Error deleting tenant");
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const changeAccountHolder = async (tenantId) => {
        try {
            setShowLoader(true)
            const response = await fetch(`/api/user/tenants/holder/${tenantId}`, {
                method: 'PUT',
            });
            
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchTenants(userId);
            } else {
                toast.error("Failed to update account holder");
            }
        } catch (error) {
            toast.error("Error updating account holder");
        } finally {
            setShowLoader(false)
        }
    };

    // Open modal to add tenant
    const openAddTenantModal = () => {
        setIsModalOpen(true);
        setTenantForm({ id: null, firstName: '', middleName: '', lastName: '', email: '', contactNumber: '' });
    };

    // Open modal to edit tenant
    const openEditTenantModal = (tenant) => {
        setIsModalOpen(true);
        setTenantForm({
            id: tenant.id,
            firstName: tenant.firstName,
            middleName: tenant.middleName,
            lastName: tenant.lastName,
            email: tenant.email,
            contactNumber: tenant.contact_number,
        });
    };

    return (
        <div className="container mx-auto p-6">
            {showLoader &&
            <div className="p-10 fixed overflow-hidden inset-0 bg-white/70 flex flex-col justify-center items-center gap-3 z-[999]">
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#ff5a1f" stroke-linecap="round" stroke-linejoin="round" id="Loader-2--Streamline-Tabler" height="48" width="48"><path d="M7.5 1.875a5.625 5.625 0 1 0 5.625 5.625" stroke-width="1"></path></svg>
                <p className="font-semibold text-gray-600">Please wait while we process your request...</p>
            </div>
            }
            <ToastContainer />
            {/* Button to open modal */}
            <button 
                onClick={openAddTenantModal}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 mb-4"
            >
                Add Tenant
            </button>

            {/* Search Input */}
            {/* <div className="mb-4">
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search tenants by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div> */}

            {/* Tenants Table */}
            <div className="bg-white shadow-md rounded-md overflow-hidden">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Full Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Contact Number</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Is Account Holder?</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.length > 0 && tenants.map((tenant) => (
                            <tr key={tenant.id} className="border-b">
                                <td className="px-4 py-4 text-sm text-gray-800">
                                    {tenant.firstName} {tenant.middleName} {tenant.lastName}
                                    {tenant.is_account_holder == 1 && <span className="ml-1 text-blue-600">(Account Holder)</span>}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-800 capitalize">{tenant.contact_number ?? 'No contact number'}</td>
                                <td className="px-4 py-4 text-sm text-gray-800 capitalize">
                                    <div className="flex items-center">
                                        <label className={`relative inline-flex items-center ${tenant.is_account_holder == 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={tenant.is_account_holder == 1}
                                                disabled={tenant.is_account_holder == 1}
                                                onChange={() => changeAccountHolder(tenant.id)}
                                            />
                                            <span className={`w-11 h-6  rounded-full ${
                                                    tenant.is_account_holder == 1 ? ' bg-green-600' : 'bg-gray-200'
                                                }`}></span>
                                            <span
                                                className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                                                    tenant.is_account_holder == 1 ? 'transform translate-x-5 bg-blue-600' : ''
                                                }`}
                                            ></span>
                                        </label>
                                    </div>
                                </td>
                                {(tenant.is_account_holder == 0 || tenants.length == 1) &&
                                    <td className="px-4 py-4 text-sm text-gray-800">
                                        <button
                                            onClick={() => {
                                                setTenantToDelete(tenant);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        >
                                            Remove Tenant
                                        </button>
                                    </td>
                                }
                            </tr>
                        ))}
                        {tenants.length <= 0 && (
                            <tr className="border-b">
                                <td className="px-4 py-4 text-sm text-center text-red-600" colSpan={4}>No tenants found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            {/* Modal for Add/Update Tenant */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">
                            {tenantForm.id ? 'Edit Tenant' : 'Add Tenant'}
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">First Name*</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={tenantForm.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={tenantForm.middleName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={tenantForm.lastName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={tenantForm.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Contact Number*</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={tenantForm.contactNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                                >
                                    {tenantForm.id ? 'Update' : 'Add'} Tenant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
                    <div className="bg-white p-6 rounded-md w-1/3">
                        <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
                        <p className="mt-2 text-gray-600">Are you sure you want to delete this tenant?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteTenant}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantsList;
