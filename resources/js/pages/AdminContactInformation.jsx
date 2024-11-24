import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContactInformation() {
    const [contactInfo, setContactInfo] = useState({
        companyName: '',
        address: '',
        email: '',
        contactNumber: '',
        telephone: ''
    });
    const [isExisting, setIsExisting] = useState(false); // Check if contact info already exists

    useEffect(() => {
        // Fetch existing contact information on component mount
        axios.get('/api/contact-show')
            .then(response => {
                if (response.data) {
                    setContactInfo({
                        companyName: response.data.company_name,
                        address: response.data.address,
                        email: response.data.email,
                        contactNumber: response.data.contact_number,
                        telephone: response.data.telephone
                    });
                    setIsExisting(true); // Set to true if data already exists
                }
            })
            .catch(error => {
                console.error('Error fetching contact info:', error);
                toast.error('Failed to fetch contact information');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactInfo({ ...contactInfo, [name]: value });
    };

    const submitContactInfo = (e) => {
        e.preventDefault();
        const payload = {
            companyName: contactInfo.companyName,
            address: contactInfo.address,
            email: contactInfo.email,
            contactNumber: contactInfo.contactNumber,
            telephone: contactInfo.telephone
        };

        if (isExisting) {
            // Update existing contact info
            axios.put('/api/contact-update', payload)
                .then(response => {
                    toast.success('Contact information updated successfully!');
                })
                .catch(error => {
                    console.error('Error updating contact info:', error.response.data);
                    toast.error('Failed to update contact information');
                });
        } else {
            // Create new contact info
            axios.post('/api/contact-store', payload)
                .then(response => {
                    toast.success('Contact information created successfully!');
                    setIsExisting(true); // Set to true after creating new contact info
                })
                .catch(error => {
                    console.error('Error creating contact info:', error.response.data); // Log validation errors
                    toast.error('Failed to create contact information');
                });
        }
    };

    return (
        <div className="container mx-auto p-8">
            <ToastContainer />
            <h1 className="text-3xl font-bold text-center mb-8">Contact Information</h1>
            <form onSubmit={submitContactInfo} className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-lg">
                <div>
                    <label className="block font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={contactInfo.companyName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter company name"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700">Company Address</label>
                    <input
                        type="text"
                        name="address"
                        value={contactInfo.address}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter company address"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={contactInfo.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700">Mobile Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={contactInfo.contactNumber}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter mobile number"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700">Telephone</label>
                    <input
                        type="text"
                        name="telephone"
                        value={contactInfo.telephone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter telephone number"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-gradient-to-r from-[#F28705] to-[#d37604] text-white py-3 px-6 rounded-lg shadow-lg font-semibold hover:from-orange-600 hover:to-orange-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {isExisting ? 'Update' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default ContactInformation;
