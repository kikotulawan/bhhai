import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const AdminPaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    const fetchPayments = async (page = 1, search = "", status = "All", entries = 5) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/payments`, {
                params: { page, search, status: status !== "All" ? status : undefined, per_page: entries },
            });
            setPayments(response.data.data);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments(currentPage, searchTerm, statusFilter, entriesPerPage);
    }, [currentPage, searchTerm, statusFilter, entriesPerPage]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleEntriesChange = (event) => {
        setEntriesPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, (char) => char.toUpperCase());
      };

    // Render pagination buttons
    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md mx-1 ${
                        i === currentPage
                            ? "bg-orange-400 text-white font-bold"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                >
                    &lt;
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                >
                    &gt;
                </button>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Payments History</h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Search Payments"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded w-full md:w-1/3"
                />

                <div className="flex gap-4 items-center">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="p-2 border border-gray-300 rounded w-full md:w-auto"
                    >
                        <option value="All">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        
                    </select>

                    <label className="text-gray-700">Show</label>
                    <select
                        value={entriesPerPage}
                        onChange={handleEntriesChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                    <span className="text-gray-700">entries</span>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : payments.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg font-medium">No payments found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr>
                                
                                <th className="px-4 md:px-6 py-3 text-left border-b font-semibold">Gcash Ref #</th>
                                <th className="px-4 md:px-6 py-3 text-left border-b font-semibold">Account Holder</th>
                                <th className="px-4 md:px-6 py-3 text-left border-b font-semibold">Amount</th>
                                <th className="px-4 md:px-6 py-3 text-left border-b font-semibold">Period Covered</th>
                                <th className="px-4 md:px-6 py-3 text-left border-b font-semibold">Next Due</th>
                                <th className="px-4 md:px-6 py-3 text-left border-b font-semibold">Status</th>
                                <th className="px-4 md:px-6 py-3 text-left border-b font-semibold">Transaction Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-100">
                                    
                                    <td className="px-4 md:px-6 py-4 border-b">{payment.gcash_reference_id}</td>
                                    <td className="px-4 md:px-6 py-4 border-b">
                                    {capitalizeFirstLetter(payment.user?.firstName || "")} {capitalizeFirstLetter(payment.user?.lastName || "")}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 border-b">{payment.amount}</td>
                                    <td className="px-4 md:px-6 py-4 border-b">{payment.period_covered}</td>
                                    <td className="px-4 md:px-6 py-4 border-b">{payment.next_due}</td>
                                    <td className="px-4 md:px-6 py-4 border-b">
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold uppercase rounded ${
                                                payment.status === "approved"
                                                    ? "bg-green-100 text-green-600"
                                                    : payment.status === "rejected"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 border-b">
                                        {moment(payment.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {renderPagination()}
                </div>
            )}
        </div>
    );
};

export default AdminPaymentHistory;
