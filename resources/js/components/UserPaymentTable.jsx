import React, { useState } from "react";
import PaymentModal from "./PaymentModal";

const UserPaymentTable = ({ users, year, refreshPayments }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const openModal = (user, month) => {
        setSelectedUser(user);
        setSelectedMonth(month);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setSelectedMonth(null);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">User</th>
                        {[...Array(12).keys()].map((_, index) => (
                            <th key={index} className="py-2 px-4 border">
                                {new Date(0, index).toLocaleString("default", {
                                    month: "short",
                                })}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="py-2 px-4 border">{user.name}</td>
                            {[...Array(12).keys()].map((_, index) => {
                                const month = index + 1;
                                const payment = user.payments.find(
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
                                                    openModal(user, month)
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
                    ))}
                </tbody>
            </table>

            {showModal && (
                <PaymentModal
                    userId={selectedUser.id}
                    year={year}
                    month={selectedMonth}
                    onClose={closeModal}
                    refreshPayments={refreshPayments}
                />
            )}
        </div>
    );
};

export default UserPaymentTable;
