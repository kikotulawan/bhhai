import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminCreateSchedule = () => {
    const [loading, setLoading] = useState(false);
    const [scheduleDetails, setScheduleDetails] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endMonth, setEndMonth] = useState(null);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        fetchUsers();
        fetchBlocks();
    }, [selectedBlock]);

    const fetchBlocks = async () => {
        try {
            const response = await axios.get("/api/blocks");
            const sortedBlocks = response.data.sort((a, b) => a - b);
            setBlocks(sortedBlocks);
        } catch (error) {
            console.error("Error fetching blocks:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/fetch-account-holders", {
                params: selectedBlock ? { block: selectedBlock } : {},
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch account holders.");
        }
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allUserIds = filteredUsers.map((user) => user.id);
            setSelectedUsers(allUserIds);
        } else {
            setSelectedUsers([]);
        }
    };

    const handleCreateSchedule = async (e) => {
        e.preventDefault();
    
        if (!scheduleDetails || selectedUsers.length === 0) {
            toast.error("Please enter schedule details and select at least one user.");
            return;
        }
    
        // Format startDate and endMonth to match the backend requirements
        const dueDate = startDate ? format(startDate, "yyyy-MM-dd") : null;
        const formattedEndMonth = endMonth ? format(endMonth, "yyyy-MM") : null;
    
        const scheduleData = {
            selectedHolders: Array.isArray(selectedUsers) ? selectedUsers : [selectedUsers],
            scheduleDetails,
            dueDate,
            endMonth: formattedEndMonth,
            amount: parseInt(amount), // Ensure amount is an integer
        };
    
        setLoading(true);
        try {
            await axios.post("/api/schedule", scheduleData);
            toast.success("Schedule created successfully");
            setScheduleDetails("");
            setSelectedUsers([]);
            setStartDate(null);
            setEndMonth(null);
            setAmount("");
            setSearchQuery("");
            setSelectedBlock("");
        } catch (error) {
            console.error("Error creating schedule:", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || "Error creating schedule.");
            } else {
                toast.error("Error creating schedule.");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesBlock = !selectedBlock || user.block === selectedBlock;
        const firstName = user.firstName ? user.firstName.toLowerCase() : "";
        const lastName = user.lastName ? user.lastName.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const matchesSearch =
            firstName.includes(searchQuery.toLowerCase()) ||
            lastName.includes(searchQuery.toLowerCase()) ||
            email.includes(searchQuery.toLowerCase());
        return matchesBlock && matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-8 bg-white ">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold text-gray-800">
                    Payment Schedule
                </h2>
                <button
                    onClick={handleCreateSchedule}
                    disabled={loading}
                    className={`${
                        loading ? "bg-blue-300" : "bg-blue-700 hover:bg-blue-800"
                    } text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                    {loading ? "Creating..." : "Make Schedule"}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#F4F4F4] p-6 rounded-sm">
                    <label className="font-medium text-xl text-gray-700 mb-2 block">
                        Schedule Details
                    </label>

                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                            <label className="font-medium text-gray-700 mb-2 block">
                                Starting Due Date (MMM dd yyyy)
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MMM dd yyyy"
                                placeholderText="Nov 8 2024"
                                className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                showPopperArrow={false}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="font-medium text-gray-700 mb-2 block">
                                End Month (MMMM yyyy)
                            </label>
                            <DatePicker
                                selected={endMonth}
                                onChange={(date) => setEndMonth(date)}
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                placeholderText="December 2024"
                                className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                showPopperArrow={false}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 font-medium mb-1 block">Amount (PHP)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the amount"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 font-medium mb-1 block">Description</label>
                        <textarea
                            value={scheduleDetails}
                            onChange={(e) => setScheduleDetails(e.target.value)}
                            className="border border-gray-300 p-3 rounded-md w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter schedule details (e.g., description)"
                        />
                    </div>
                </div>

                {/* Grouped Filter, Search, and Account Holders Selection */}
                <div className="bg-[#F4F4F4] p-6 rounded-sm space-y-6">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
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
                        <div className="w-1/2">
                            <label className="font-medium text-gray-700 mb-2 block">
                                Search Users
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search by name or email"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Select Account Holders
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600 border">
                                <thead className="text-xs uppercase bg-gray-200 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="px-4 py-3">Account Holder Name</th>
                                        <th className="px-4 py-3">Block</th>
                                        <th className="px-4 py-3">Lot</th>
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
                                              <td className="px-4 py-3">{user.block}</td>
                                              <td className="px-4 py-3">{user.lot}</td>
                                          </tr>
                                      ))
                                  )}
                              </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateSchedule;
