import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope,FaStar, FaMapMarkerAlt, FaEnvelopeOpenText, FaMobileAlt, FaPhoneAlt, FaBuilding } from 'react-icons/fa';

function ContactUs() {
    const [feedback, setFeedback] = useState({
        username_or_email: '',
        message: '',
        rating: 0
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [contactInfo, setContactInfo] = useState({
        companyName: '',
        address: '',
        email: '',
        contactNumber: '',
        telephone: ''
    });

    // State for handling the modal
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch contact information from the backend
        axios.get('/api/contact-show')
            .then(response => {
                const data = response.data;
                setContactInfo({
                    companyName: data.company_name,
                    address: data.address,
                    email: data.email,
                    contactNumber: data.contact_number,
                    telephone: data.telephone
                });
            })
            .catch(error => console.error('Error fetching contact info:', error));
    }, []);

    const handleChange = (e) => {
        setFeedback({ ...feedback, [e.target.name]: e.target.value });
    };

    const handleRating = (rating) => {
        setFeedback({ ...feedback, rating });
    };

    const handleMouseEnter = (rating) => {
        setHoverRating(rating);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Basic validation in React before sending data to the backend
        if (!feedback.username_or_email) {
            alert("Please enter your username or email.");
            return;
        }
    
        if (!feedback.message) {
            alert("Please enter your feedback message.");
            return;
        }
    
        if (feedback.rating < 1 || feedback.rating > 5) {
            alert("Please provide a valid rating (1-5).");
            return;
        }
    
        // If all fields are valid, proceed with sending the data
        axios.post('/api/feedback', feedback)
            .then(response => {
                console.log("Feedback submitted:", response.data);
                setFeedback({ username_or_email: '', message: '', rating: 0 });
                setShowModal(true); // Show thank you modal after submission
            })
            .catch(error => {
                if (error.response) {
                    // Check for validation errors returned from the server
                    const errorMessage = error.response.data.errors
                        ? Object.values(error.response.data.errors).join(', ')
                        : 'There was an issue submitting your feedback. Please try again later.';
                    alert(`Error: ${errorMessage}`);
                } else {
                    console.error('Error:', error);
                    alert("There was an issue submitting your feedback. Please try again later.");
                }
            });
    };
    

    // Close the modal after a brief timeout
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div
                className="relative w-full h-64 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/announcement.jpg)' }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-extrabold text-center text-white py-6 px-4 rounded-lg shadow-lg">
                        Contact Us
                    </h1>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Map Section */}
                <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.0467399459844!2d120.8840241759067!3d14.822634671600445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396536689b34fdb%3A0xa92a65c1520a2df2!2sBrooklyn%20Heights%20Subdivision!5e0!3m2!1sen!2sph!4v1722839893551!5m2!1sen!2sph"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-crossgrade"
                        className="w-full h-full"
                    ></iframe>
                </div>
                
                {/* Contact Information */}
                <div className="bg-[#FAFAFA] p-6 md:p-10  flex flex-col items-center w-full">
                    <div className="w-full flex justify-center">
                    <h2 className="text-3xl font-semibold mb-8 font-sans text-gray-700 text-center">Company Information</h2>
                </div>
                <ul className="text-gray-700 space-y-6 text-lg md:text-md w-full">
                    <li className="flex items-start space-x-4">
                    <FaBuilding className="mt-1 text-2xl" style={{ color: '#FF8C00' }} />
                        <span><strong>Company Name:</strong> {contactInfo.companyName}</span>
                    </li>
                    <li className="flex items-start space-x-4">
                        <FaMapMarkerAlt className="mt-1 text-2xl" style={{ color: '#FF8C00' }} />
                        <span><strong>Address:</strong> {contactInfo.address}</span>
                    </li>
                    <li className="flex items-start space-x-4">
                        <FaEnvelopeOpenText className="mt-1 text-2xl" style={{ color: '#FF8C00' }} />
                        <span><strong>Email:</strong> {contactInfo.email}</span>
                    </li>
                    <li className="flex items-start space-x-4">
                        <FaMobileAlt className="mt-1 text-2xl" style={{ color: '#FF8C00' }} />
                        <span><strong>Mobile Number:</strong> {contactInfo.contactNumber}</span>
                    </li>
                    <li className="flex items-start space-x-4">
                        <FaPhoneAlt className="mt-1 text-2xl" style={{ color: '#FF8C00' }} />
                        <span><strong>Telephone:</strong> {contactInfo.telephone}</span>
                    </li>
                </ul>
            </div>
        </div>

            {/* Feedback Form */}
            <div className="bg-[#FAFAFA] p-8 rounded-md mb-6 w-3/4 mx-auto border border-gray-300">
                <h2 className="text-4xl font-semibold mb-6 font-sans text-center">
                    We’d Love to Hear From You! Share Your Thoughts Below
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label htmlFor=" username_or_email" className="block font-medium text-gray-700 text-base">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="username_or_email" 
                            name="username_or_email"  
                            value={feedback.username_or_email}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full p-4 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
                            placeholder="Enter your username or email"
                        />
                        <FaUser className="absolute left-3 top-12 text-gray-400 text-xl" />
                    </div>
                    <div className="relative">
                        <label htmlFor="message" className="block font-medium text-gray-700 text-base">
                            Feedback Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={feedback.message}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
                            placeholder="State your feedback"
                            rows="3"
                        ></textarea>
                        <FaEnvelope className="absolute left-3 top-11 text-gray-400 text-xl" />
                    </div>

                    {/* Star Rating */}
                    <div className="relative">
                        <label className="block font-medium text-gray-700 text-base mb-2">Rate Us</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer text-2xl ${
                                        (hoverRating || feedback.rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    onClick={() => handleRating(star)}
                                    onMouseEnter={() => handleMouseEnter(star)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#F28705] to-[#d37604] text-white py-2 px-5 rounded-md shadow-md font-semibold text-base hover:from-orange-600 hover:to-orange-800 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>

            {/* Thank You Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto">
                        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                            Thank You for Your Feedback!
                        </h2>
                        <p className="text-center text-gray-500 mb-6">
                            We appreciate your input and will use it to improve our services.
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={closeModal}
                                className="bg-gradient-to-r from-[#F28705] to-[#d37604] text-white py-2 px-5 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactUs;
