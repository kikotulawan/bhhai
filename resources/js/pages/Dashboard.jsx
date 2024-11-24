import React, { useState, useEffect } from "react";
import { fetchUserDetails } from "../api/user";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMoneyCheckAlt, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal"; // Import the modal component
import ViewProofModal from "../components/ViewProofModal"; // Import the view proof modal

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [user, setUser] = useState({is_account_holder: 0});
    const [userId, setUserId] = useState(null);
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
    const [activatedYears, setActivatedYears] = useState([new Date().getFullYear()]); // Default to current year
    const [payments, setPayments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMonth, setModalMonth] = useState(null);
    const [modalTotalAmount, setModalTotalAmount] = useState(0); // New state for total amount
    const [showProofModal, setShowProofModal] = useState(false); // State to control the proof modal
    const [proofUrl, setProofUrl] = useState(""); // State to store the proof URL
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [accountNumber, setAccountNumber] = useState("");
    const navigate = useNavigate();

    const openModal = (month) => {
        setModalMonth(month);
        setModalTotalAmount(calculateTotalAmount(month)); // Set the total amount
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMonth(null);
        setModalTotalAmount(0);
    };

    const openProofModal = (url) => {
        const imageUrl = `http://localhost:8000/storage/${url}`
        setProofUrl(imageUrl);
        setShowProofModal(true);
    };

    const closeProofModal = () => {
        setShowProofModal(false);
        setProofUrl("");
    };

    const calculateTotalAmount = (month) => {
        const unpaidMonths = payments.filter(
            (payment) =>
                payment.payment_status !== "Paid" &&
                payment.month <= month
        );

        const totalAmount = unpaidMonths.length * monthlyPayment; // Assuming the monthly payment is $250
        return totalAmount;
    };

    const fetchMonthlyPaymentAmount = async () => {
        try {
            const response = await axios.get(`/api/settings/monthly-payment`);
            setMonthlyPayment(response.data.monthly_payment);
            setAccountNumber(response.data.account_number);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const fetchActivatedYears = async () => {
        try {
            const response = await axios.get(`/api/user/active-years`);
            setActivatedYears([...new Set(response.data)]);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const fetchPayments = async (selectedYear, userID) => {
        try {
            const response = await axios.get(`/api/user/${userID}/payments/${selectedYear}`);
            setPayments(response.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const addPayment = async (file, month) => {
        const formData = new FormData();
        formData.append("year", year);
        formData.append("month", month);
        formData.append("proof_of_payment", file);

        try {
            setLoading(true);
            const response = await axios.post(`/api/user/${userId}/payments`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(response.data.message);
            setLoading(false);
            fetchPayments(year, userId);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to submit payment.");
        }
    };

    const fetchUserData = async () => {
        try {
            const data = await fetchUserDetails();
            if (data && data.id) {
                setUser(data)
                setUserId(data.id);
                fetchPayments(year, data.id);
                fetchActivatedYears()
                fetchMonthlyPaymentAmount()
            } else {
                toast.error("Fetched user data does not include an ID");
            }
        } catch (err) {
            toast.error("Error fetching user details");
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [year]);

    return (
        <div className="p-8">
            <ToastContainer />
            <h2 className="text-3xl font-bold mb-8 text-left">Payments</h2>

            <div className="mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Payments for {year}</h2>
                <h2 className="text-xl  mb-4 text-gray-800">Monthly Payment: PHP {monthlyPayment}</h2>
                <h2 className={`text-xl  mb-4 text-gray-800 ${user.is_account_holder === 0 && 'hidden'}`}>Gcash Number: {accountNumber}</h2>
                <div className="mb-6">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Year:
                    </label>
                    <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {activatedYears.map((yr) => (
                            <option key={yr} value={yr}>
                                {yr}
                            </option>
                        ))}
                    </select>
                </div>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Month
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Status
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Action
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.month} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                                    {new Date(0, payment.month - 1).toLocaleString("default", { month: "long" })}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                                    {payment.payment_status}
                                    <br />
                                    {(payment.transaction_reference !== null && payment.payment_status !== 'Unpaid') && `TRN: ${payment.transaction_reference}`}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                                    {(payment.payment_status === "Paid" || payment.payment_status === "Processing") && payment.proof_of_payment && (
                                        <button
                                            onClick={() => openProofModal(payment.proof_of_payment)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            View Receipt
                                        </button>
                                    )}
                                    {(payment.payment_status === "Unpaid" || payment.payment_status === "Rejected") && (
                                        <button
                                            onClick={() => openModal(payment.month)}
                                            disabled={payments.some((p) => p.payment_status === "Processing") || user.is_account_holder === 0}
                                            className={`px-4 py-2 bg-indigo-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg hover:bg-indigo-600 ${
                                                payments.some((p) => p.payment_status === "Processing")
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }` }
                                        >
                                            Add Payment
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showModal}
                onClose={closeModal}
                onConfirm={(file) => {
                    addPayment(file, modalMonth);
                    closeModal();
                }}
                month={modalMonth}
                year={year}
                totalAmount={modalTotalAmount}
            />

            {/* View Proof Modal */}
            <ViewProofModal
                isOpen={showProofModal}
                onClose={closeProofModal}
                proofUrl={proofUrl}
            />
        </div>
    );
};

export default Dashboard;
