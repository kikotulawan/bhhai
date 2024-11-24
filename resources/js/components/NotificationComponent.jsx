import React, { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Setup Laravel Echo to use Pusher (or Soketi) as the broadcaster
// window.Pusher = Pusher;

const userId = localStorage.getItem("userId"); // Assuming you're getting the user's ID from localStorage or another source

// window.Echo = new Echo({
//     broadcaster: "pusher",
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     wsHost: window.location.hostname,
//     wsPort: 6001, // The Soketi port
//     forceTLS: false,
//     disableStats: true,
//     // This ensures the auth endpoint is hit correctly:
//     authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
//     auth: {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`, // Or use cookies if that's your auth method
//         },
//     },
// });

const NotificationComponent = () => {
    useEffect(() => {
        // Listen for private notifications on the user's channel
        // window.Echo.private(`App.Models.User.${userId}`)
        //     .notification((notification) => {
        //         console.log('Notification received: ', notification.message);
        //         // Here, you can update your UI with the notification
        //         alert(notification.message);  // Example: Show a popup with the notification
        //     });
    }, []);

    return <div></div>;
};

export default NotificationComponent;
