import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ScheduleDetailModal = ({ isOpen, onClose, schedules }) => {
    if (!isOpen || !schedules) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-center">Schedule Details</h3>
                {schedules.map((schedule, index) => (
                    <div key={index} className="mb-4 border-b pb-2">
                        <p><strong>Amount:</strong> {schedule.amount}</p>
                        <p><strong>Description:</strong> {schedule.description}</p>
                        <p><strong>Due Date:</strong> {schedule.due_date}</p>
                        <p><strong>Status:</strong> <span className={`font-semibold px-2 py-1 rounded ${
                            schedule.status === 'Paid' ? 'bg-green-200 text-green-800' :
                            schedule.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                        }`}>
                            {schedule.status}
                        </span></p>
                    </div>
                ))}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const ViewSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchedules, setSelectedSchedules] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/getschedules");
            const fetchedSchedules = response.data;

            const aggregatedSchedules = fetchedSchedules.reduce((acc, schedule) => {
                const userId = schedule.user.id;
                if (!acc[userId]) {
                    acc[userId] = {
                        user: schedule.user,
                        schedules: [],
                    };
                }
                acc[userId].schedules.push({
                    amount: schedule.amount,
                    description: schedule.description,
                    due_date: schedule.due_date,
                    status: schedule.status,
                });
                return acc;
            }, {});

            setSchedules(Object.values(aggregatedSchedules));
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Failed to fetch schedules.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (schedules) => {
        setSelectedSchedules(schedules);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSchedules(null);
        setIsModalOpen(false);
    };

    const filteredSchedules = schedules.filter(schedule =>
        `${schedule.user.firstName} ${schedule.user.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, (char) => char.toUpperCase());
      };



    return (
        <div className="min-h-screen container mx-auto p-8 bg-white rounded-lg ">
            <ToastContainer />
            <ScheduleDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                schedules={selectedSchedules}
            />

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-800">Schedules</h2>
                <Link
                    to="/AdminCreateSchedule"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Create Schedule
                </Link>
            </div>

            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search Assigned Account Holders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                />
            </div>

            {loading ? (
                <p className="text-gray-600">Loading schedules...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">Assigned Account Holders</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSchedules.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center py-4 text-gray-500">
                                        No schedules found.
                                    </td>
                                </tr>
                            ) : (
                                filteredSchedules.map((userSchedule) => (
                                    <tr key={userSchedule.user.id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4">
                                            {capitalizeFirstLetter(userSchedule.user?.firstName || "")} {capitalizeFirstLetter(userSchedule.user?.lastName || "")}
                                        </td>
                                        <td className="px-6 py-4 flex justify-center space-x-2">
                                            <button
                                                onClick={() => openModal(userSchedule.schedules)}
                                                className="bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800 flex items-center"
                                            >
                                                <FaEye className="w-4 h-4 mr-1" />
                                                View
                                            </button>
                                            <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center">
                                                <FaEdit className="w-4 h-4 mr-1" />
                                                Edit
                                            </button>
                                            <button className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center">
                                                <FaTrash className="w-4 h-4 mr-1" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
            )}
        </div>
    );
};

export default ViewSchedules;
