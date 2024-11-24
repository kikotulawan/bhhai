import { useState, useEffect  } from "react";
import axios from "axios";

const SpamNotificationToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    // Fetch the current value of the setting from the backend
    useEffect(() => {
        const fetchSetting = async () => {
            try {
                // Make a GET request to fetch the current setting value
                const response = await axios.get("/api/settings/spam-notifications");

                // Set the initial state based on the response value
                setIsEnabled(response.data.enable_spam_notifications);
            } catch (error) {
                console.error("Error fetching spam notifications setting", error);
            }
        };

        fetchSetting();
    }, []);

    // Handle toggle change
    const handleToggleChange = async () => {
        const newStatus = !isEnabled;
        setIsEnabled(newStatus);

        try {
            // Send PUT request to update the `enable_spam_notifications` field
            await axios.put("/api/settings/spam-notifications", {
                enable_spam_notifications: newStatus,
            });
        } catch (error) {
            console.error("Error updating spam notifications setting", error);
            // If request fails, revert toggle state (you can add a toast or alert for failure)
            setIsEnabled(isEnabled);
        }
    };

    return (
        <div className="flex flex-col max-w-[250px]">
            <div className="flex items-center">
                <span className="mr-3 text-lg font-medium text-gray-700">
                    Spam Notifications
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEnabled}
                        onChange={handleToggleChange}
                    />
                    <span className={`w-11 h-6  rounded-full ${
                            isEnabled ? ' bg-green-600' : 'bg-gray-200'
                        }`}></span>
                    <span
                        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            isEnabled ? 'transform translate-x-5 bg-blue-600' : ''
                        }`}
                    ></span>
                </label>
            </div>
            <small className="text-gray-700">A payment reminder notification will be sent to the users every 30 minutes.</small>
        </div>
    );
};

export default SpamNotificationToggle;
