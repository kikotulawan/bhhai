import React, { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal";
import axios from "axios";

const PayorPaymentsTable = () => {
    const [payments, setPayments] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [showModal, setShowModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const fetchUserPayments = async () => {
        try {
            const response = await axios.get(`/api/user/payments?year=${year}`);
            setPayments(response.data);
        } catch (error) {
            console.error("Failed to fetch payments:", error);
        }
    };

    const openModal = (month) => {
        setSelectedMonth(month);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMonth(null);
    };

    useEffect(() => {
        fetchUserPayments();
    }, [year]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Payments</h1>

            {/* Year Selector */}
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                    Select Year:
                </label>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="ml-2 border border-gray-300 rounded px-2 py-1"
                >
                    {[...Array(5).keys()].map((offset) => (
                        <option
                            key={offset}
                            value={new Date().getFullYear() - offset}
                        >
                            {new Date().getFullYear() - offset}
                        </option>
                    ))}
                </select>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            {[...Array(12).keys()].map((_, index) => (
                                <th
                                    key={index}
                                    className="py-2 px-4 border bg-gray-50 text-gray-700"
                                >
                                    {new Date(0, index).toLocaleString(
                                        "default",
                                        { month: "short" }
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {[...Array(12).keys()].map((_, index) => {
                                const month = index + 1;
                                const payment = payments.find(
                                    (p) => p.month === month && p.year === year
                                );

                                return (
                                    <td
                                        key={month}
                                        className={`py-2 px-4 border ${
                                            payment?.payment_status === "Paid"
                                                ? "bg-green-100"
                                                : payment?.payment_status ===
                                                  "Processing"
                                                ? "bg-yellow-100"
                                                : ""
                                        }`}
                                    >
                                        {payment ? (
                                            payment.payment_status
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    openModal(month)
                                                }
                                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Add Payment
                                            </button>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Payment Modal */}
            {showModal && (
                <PaymentModal
                    year={year}
                    month={selectedMonth}
                    onClose={closeModal}
                    refreshPayments={fetchUserPayments}
                />
            )}
        </div>
    );
};

export default PayorPaymentsTable;
