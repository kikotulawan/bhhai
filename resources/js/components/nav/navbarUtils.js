import axiosInstance from "../../axiosConfig";
import axios from "axios";

// Function to fetch login status
export const fetchLoginStatus = async (setIsLoggedIn, setUser, setLoading) => {
    const token = localStorage.getItem("token");
    if (!token) {
        setLoading(false);
        return;
    }
    try {
        const response = await axiosInstance.get("/auth/status");
        setIsLoggedIn(response.data.isAuthenticated);
        setUser(response.data.user);
    } catch (error) {
        console.error("Error fetching authentication status:", error);
    } finally {
        setLoading(false);
    }
};

// Function to handle user logout
export const handleLogout = async (setIsLoggedIn, setUser, navigate) => {
    try {
        await axiosInstance.post("/logout");
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

// Utility function to capitalize the first letter of a string
export const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Function to toggle dropdown visibility
export const toggleDropdown = (
    isDropdownOpen,
    setIsDropdownOpen,
    setIsNotificationOpen
) => {
    if (isDropdownOpen) {
        setIsDropdownOpen(false); // Close the profile dropdown if it's already open
    } else {
        setIsNotificationOpen(false); // Ensure the notification dropdown is closed
        setIsDropdownOpen(true); // Open the profile dropdown
    }
};

// Function to toggle the notification dropdown and fetch notifications
export const toggleNotification = async (
    isNotificationOpen,
    setIsNotificationOpen,
    setNotifications
) => {
    const userId = localStorage.getItem("userId");
    if (isNotificationOpen) {
        setIsNotificationOpen(false); // Close the notification dropdown if it's already open
    } else {
        setIsNotificationOpen(true); // Open the notification dropdown
    }
};
// Function to handle notification click and mark it as read
export const handleNotificationClick = async (id) => {
    try {
        await axiosInstance.put(`/notifications/${id}/read`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};
