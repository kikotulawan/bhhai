import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Feedback() {
    const [feedback, setFeedback] = useState({
        usernameOrEmail: '',
        message: '',
        rating: 0
    });
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        axios.get('/api/feedbackIndex')
            .then(response => setFeedbackList(Array.isArray(response.data) ? response.data : []))
            .catch(error => console.error('Error fetching feedback:', error));
    }, []);

    return (
        <div className="min-h-screen relative overflow-x-auto shadow-md sm:rounded-lg p-4 bg-[#FAFAFA]">
            <h1 className="text-3xl font-bold text-left mb-4">Feedback</h1>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg ">
                <thead>
                 <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-medium">
                        <th className="px-6 py-3 text-center">Username/Email</th>
                        <th className="px-6 py-3 text-center">Message</th>
                        <th className="px-6 py-3 text-center">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbackList.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 text-center">
                            <td className="px-6 py-3 text-center">{item.username_or_email}</td>
                            <td className="px-6 py-3 text-center">{item.message}</td>
                            <td className="px-6 py-3 text-center">{item.rating}</td>
                        </tr>
                    ))}
                    {feedbackList.length === 0 && (
                        <tr>
                            <td colSpan="3" className="text-center py-4 text-gray-500">
                                No feedback available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Feedback;
