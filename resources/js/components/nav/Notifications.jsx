import React, { useState, useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";
import { toggleNotification, handleNotificationClick } from "./navbarUtils";

window.Pusher = Pusher;

function Notifications({ isNotificationOpen, setIsNotificationOpen, setIsDropdownOpen }) {
    const userId = localStorage.getItem("userId");
    const [notifications, setNotifications] = useState([]);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/api/notifications/${userId}`);
                setNotifications(response.data);
                setHasUnreadNotifications(response.data.some((notif) => notif.read === 0));
            } catch (error) {
                console.error(error);
            }
        };

        const echo = new Echo({
            broadcaster: "pusher",
            key: "c07cb560bf67cdc1d44d",
            cluster: "ap1",
            encrypted: true,
        });

        echo.channel(`user.${userId}`).listen(".user-notification", fetchNotifications);

        fetchNotifications();
        return () => echo.disconnect();
    }, []);

    const handleNotificationButtonClick = () => {
        setIsDropdownOpen(false);
        toggleNotification(isNotificationOpen, setIsNotificationOpen, setNotifications);
    };

    const markAsRead = (notificationId) => {
        handleNotificationClick(notificationId);
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === notificationId ? { ...notification, read: 1 } : notification
            )
        );
        setHasUnreadNotifications(false);
    };

    const openModal = (notification) => {
        setSelectedNotification(notification);
        document.body.style.overflowY = "hidden";
    };

    const closeModal = () => {
        setSelectedNotification(null);
        document.body.style.overflowY = "auto";
    };

    return (
        <div className="relative flex items-center">
            <button
                id="dropdownNotificationButton"
                className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none"
                type="button"
                onClick={handleNotificationButtonClick}
            >
                <svg
                    className="w-7 h-7 text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#333333"
                    viewBox="0 0 24 24"
                >
                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                </svg>
                {hasUnreadNotifications && (
                    <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-1 -right-1"></div>
                )}
            </button>

            {isNotificationOpen && (
                <div className="z-30 absolute right-0 w-[320px] bg-white divide-y divide-gray-100 rounded-lg shadow-lg overflow-hidden top-14 py-2 px-2">
                    <div className="block px-4 py-2 font-medium text-center text-gray-700 bg-gray-100">
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="w-6 h-6 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="#333333"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                                </svg>
                                <span>Notifications</span>
                            </div>
                        </div>
                    <div className="divide-y divide-gray-200">
                        {notifications.length ? (
                            notifications.slice(0, 5).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                                        notification.read === 0 ? "bg-gray-200" : ""
                                    }`}
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        openModal(notification);
                                        setIsNotificationOpen(false);
                                    }}
                                >
                                    <div className="text-gray-600 text-sm">
                                        <p className="line-clamp-2">{notification.message}</p>
                                        <small className="text-gray-400">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="px-4 py-3 text-sm text-gray-500">No new notifications</p>
                        )}
                    </div>
                    {/* "View All" button */}
                    {notifications.length > 5 && (
                            <div className="text-center py-2">
                                <button
                                    onClick={() => window.location.href = '/all-notifications'} // Navigates to the View All page
                                    className="text-blue-500 hover:underline text-sm"
                                >
                                    View All
                                </button>
                            </div>
                        )}
                </div>
            )}

            {selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-transform duration-300 ease-out scale-95 sm:scale-100 sm:translate-y-0">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-1">
                                <svg
                                    className="w-6 h-6 text-orange-600"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="#F25C05"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                                </svg>
                                <h2 className="text-xl font-semibold text-gray-800">Notification</h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                aria-label="Close Notification"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="text-gray-700 mb-4">
                            <p className="text-lg font-medium">{selectedNotification.message}</p>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>Status: <span className={`font-semibold ${selectedNotification.read ? "text-green-500" : "text-red-500"}`}>{selectedNotification.read ? "Read" : "Unread"}</span></p>
                            <p>Date: {new Date(selectedNotification.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notifications;
