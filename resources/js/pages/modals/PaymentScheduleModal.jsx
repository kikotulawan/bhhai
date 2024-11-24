import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import BeatLoader from 'react-spinners/BeatLoader';
import { fetchUserSchedules } from '../../api/user';
import axiosInstance from '../../axiosConfig';

const PaymentScheduleModal = ({ isOpen, onClose, userId }) => {
    const [block, setBlock] = useState('');
    const [lotRangeStart, setLotRangeStart] = useState('');
    const [lotRangeEnd, setLotRangeEnd] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userSchedules, setUserSchedules] = useState([]);

    useEffect(() => {
        if (isOpen && userId) {
            const getUserSchedules = async () => {
                setLoading(true);
                const schedules = await fetchUserSchedules(userId);
                if (schedules) {
                    setUserSchedules(schedules);
                }
                setLoading(false);
            };

            getUserSchedules();
        }
    }, [isOpen, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!block || !lotRangeStart || !lotRangeEnd || !amount || !dueDate) {
            setError('Please fill out all required fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post('/payment-schedules', {
                block,
                lotRangeStart,
                lotRangeEnd,
                amount,
                description,
                due_date: dueDate,
                remarks,
            });
            console.log('Schedule created successfully:', response.data);
            // Handle successful creation, e.g., show success message
            onClose();
        } catch (error) {
            console.error('Failed to create payment schedule:', error.response?.data || error.message);
            setError('Failed to create payment schedule: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="relative w-full max-w-full sm:max-w-lg lg:max-w-2xl bg-white shadow-lg rounded-md p-6 sm:p-8 overflow-y-auto max-h-full">
                <div className="relative mb-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">Create Payment Schedule</h3>
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800">User Schedules:</h4>
                    {loading ? (
                        <div>Loading schedules...</div>
                    ) : userSchedules.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {userSchedules.map((schedule, index) => (
                                <li key={index}>
                                    {schedule.description} - Due: {new Date(schedule.due_date).toLocaleDateString()} - Amount: PHP {schedule.amount}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No schedules found.</p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Block Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="block">
                            Block
                        </label>
                        <input
                            type="number"
                            id="block"
                            name="block"
                            value={block}
                            onChange={(e) => setBlock(e.target.value)}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Lot Range Inputs */}
                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="lotRangeStart">
                                Lot Range Start
                            </label>
                            <input
                                type="number"
                                id="lotRangeStart"
                                name="lotRangeStart"
                                value={lotRangeStart}
                                onChange={(e) => setLotRangeStart(e.target.value)}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="lotRangeEnd">
                                Lot Range End
                            </label>
                            <input
                                type="number"
                                id="lotRangeEnd"
                                name="lotRangeEnd"
                                value={lotRangeEnd}
                                onChange={(e) => setLotRangeEnd(e.target.value)}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="amount">
                            Amount (PHP)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="description">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Due Date Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="dueDate">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Remarks Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="remarks">
                            Remarks
                        </label>
                        <input
                            type="text"
                            id="remarks"
                            name="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <BeatLoader size={10} color="#fff" />
                                    <span className="ml-2">Creating...</span>
                                </div>
                            ) : (
                                'Create Schedule'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentScheduleModal;