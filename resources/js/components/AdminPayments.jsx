import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Limit to 10 items per page
    const [rejectModal, setRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`/api/admin/payments?page=${currentPage}`);
            setPayments(response.data);
            fetchMonthlyPaymentAmount()
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const fetchMonthlyPaymentAmount = async () => {
        try {
            const response = await axios.get(`/api/admin/payments?page=${currentPage}`);
            setMonthlyPayment(response.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [currentPage]);

    const approvePayment = async (paymentId) => {
        try {
            const response = await axios.post(`/api/admin/payments/${paymentId}/approve`);
            toast.success(response.data.message);
            fetchPayments();
        } catch (error) {
            toast.error("Failed to approve payment.");
        }
    };

    const openRejectModal = (payment) => {
        setSelectedPayment(payment);
        setRejectModal(true);
    };

    const closeRejectModal = () => {
        setRejectModal(false);
        setRejectReason("");
        setSelectedPayment(null);
    };

    const rejectPayment = async () => {
        try {
            if (!rejectReason.trim()) {
                toast.error("Please provide a reason for rejection.");
                return;
            }

            const response = await axios.post(`/api/admin/payments/${selectedPayment.id}/reject`, {
                reason: rejectReason,
            });

            toast.success(response.data.message);
            closeRejectModal();
            fetchPayments();
        } catch (error) {
            toast.error("Failed to reject payment.");
        }
    };

    const getGroupedPeriod = (payment) => {
        // Group periods like "Jan-March" if advance payment
        const startMonth = new Date(0, payment.start_month - 1).toLocaleString("default", { month: "short" });
        const endMonth = new Date(0, payment.end_month - 1).toLocaleString("default", { month: "short" });
        return payment.start_month !== payment.end_month ? `${startMonth}-${endMonth}` : startMonth;
    };

    const totalPages = Math.ceil(payments.total / itemsPerPage); // Calculate total pages

    return (
        <div className="p-8">
            <ToastContainer />
            <h2 className="text-3xl font-bold mb-8">Admin Payments</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">User</th>
                            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Covered Period</th>
                            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Amount</th>
                            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Proof</th>
                            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.data?.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border text-gray-700">{payment.user.firstName}</td>
                                <td className="px-4 py-2 border text-gray-700">{getGroupedPeriod(payment)}</td>
                                <td className="px-4 py-2 border text-gray-700">PHP {monthlyPayment}</td>
                                <td className="px-4 py-2 border text-gray-700">
                                    <a
                                        href={`http://localhost:8000/storage/${payment.proof_of_payment}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-500 hover:underline"
                                    >
                                        View Proof
                                    </a>
                                </td>
                                <td className="px-4 py-2 border text-gray-700 flex gap-4">
                                    <button
                                        onClick={() => approvePayment(payment.id)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => openRejectModal(payment)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Reject Payment</h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            rows="4"
                        ></textarea>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={rejectPayment}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Reject
                            </button>
                            <button
                                onClick={closeRejectModal}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayments;
