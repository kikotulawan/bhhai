import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { FiCheckCircle, FiBell, FiClock } from "react-icons/fi";
import { Pagination } from "flowbite-react";

const ViewAllNotifications = () => {
    const userId = localStorage.getItem("userId");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of notifications per page

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                const response = await axios.get(`/api/notifications/${userId}`);
                setNotifications(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setLoading(false);
            }
        };
        fetchAllNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/api/notifications/${notificationId}/mark-as-read`);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId ? { ...notification, read: 1 } : notification
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Calculate the total number of pages
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    // Paginate the notifications based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className=" min-h-screen container mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <svg
            className="w-7 h-7 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#333333"
            viewBox="0 0 24 24"
                >
                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
            </svg>
                <span>All Notifications</span>
            </h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
                <p className="text-center text-gray-500">You have no notifications.</p>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden divide-y divide-gray-200">
                        <ul>
                            {paginatedNotifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className="px-6 py-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`p-3 rounded-lg ${
                                                notification.read
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            {notification.read ? (
                                                <FiCheckCircle className="text-lg" />
                                            ) : (
                                                <FiClock className="text-lg" />
                                            )}
                                        </div>
                                        <div>
                                            <p
                                                className={`text-base font-medium ${
                                                    notification.read
                                                        ? "text-gray-500"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {notification.message}
                                            </p>
                                            <small className="text-gray-400">
                                                {moment(notification.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                                            </small>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        disabled={notification.read === 1}
                                        className={`px-4 py-2 text-sm font-medium rounded ${
                                            notification.read
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-blue-600 text-white"
                                        }`}
                                    >
                                        {notification.read ? "Read" : "Mark as Read"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pagination Component */}
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            showIcons={true}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewAllNotifications;
