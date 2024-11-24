import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "react-multi-select-component";

window.Pusher = Pusher;

const CreateNotificationPage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selected, setSelected] = useState([]);
    const options = [
      { label: "Grapes 🍇", value: "grapes" },
      { label: "Mango 🥭", value: "mango" },
      { label: "Strawberry 🍓", value: "strawberry" },
    ];

    useEffect(() => {
        const echo = new Echo({
            broadcaster: "pusher",
            key: "a7576b0155146db70649",
            cluster: "ap1",
            forceTLS: false,
            encrypted: true,
        });

        return () => {
            echo.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchBlocks();
    }, [selectedBlock]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/notifications/all-users", {
                params: { block: selectedBlock },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchBlocks = async () => {
        try {
            const response = await axios.get("/api/blocks");
            const sortedBlocks = response.data.sort((a, b) => a - b);
            setBlocks(sortedBlocks);
        } catch (error) {
            console.error("Error fetching blocks:", error);
        }
    };

    const handleUserSelection = (userIdOrIds) => {
        if (Array.isArray(userIdOrIds)) {
            setSelectedUsers(userIdOrIds);
        } else {
            setSelectedUsers((prevSelected) =>
                prevSelected.includes(userIdOrIds)
                    ? prevSelected.filter((id) => id !== userIdOrIds)
                    : [...prevSelected, userIdOrIds]
            );
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();

        if (!message || selectedUsers.length === 0) {
            toast.error("Please enter a message and select at least one user.");
            return;
        }

        setLoading(true);
        try {
            const selectedUserIds = selectedUsers.map(item => item.value);
            await axios.post("/api/send-notification", {
                userIds: selectedUserIds,
                message,
            });
            toast.success("Notification sent to users");
            setMessage("");
            setSelectedUsers([]);
        } catch (error) {
            console.error("Error sending notification:", error);
            toast.error("Error sending notification: An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // const filteredUsers = users.filter(
    //     (user) =>
    //         user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="min-h-screen container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold text-gray-800">
                    Create Notification
                </h2>
                <button
                    onClick={handleSendNotification}
                    disabled={loading}
                    className={`${
                        loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                    {loading ? "Sending..." : "Send Notifications"}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                {/* Message Field */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <label className="font-medium text-gray-700 mb-2 block">
                        Notification Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border border-gray-300 p-3 rounded-md w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your notification message..."
                    />
                </div>

                {/* Block Filter & Search Field */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <label className="font-medium text-gray-700 mb-2 block">
                            Filter by Block
                        </label>
                        <select
                            value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Blocks</option>
                            {blocks.map((block) => (
                                <option key={block} value={block}>
                                    {block}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <label className="font-medium text-gray-700 mb-2 block">
                            Search Users
                        </label>
                        {/* <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search by name or email"
                        /> */}
                        <MultiSelect
                            options={users}
                            value={selectedUsers}
                            onChange={setSelectedUsers}
                            labelledBy="Select"
                        />
                    </div>
                </div>
            </div>

            {/* User Selection Table */}
            {/* <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Select Users
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 border">
                        <thead className="text-xs uppercase bg-gray-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedUsers.length ===
                                                filteredUsers.length &&
                                            filteredUsers.length > 0
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                handleUserSelection(
                                                    filteredUsers.map(
                                                        (user) => user.id
                                                    )
                                                );
                                            } else {
                                                handleUserSelection([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Block</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-100">
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleUserSelection(user.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">{user.block}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div> */}
        </div>
    );
};

export default CreateNotificationPage;
