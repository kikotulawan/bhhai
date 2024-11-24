import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

const ProofOfPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, selectedPayments, paymentScheduleId } = location.state || {};
    const [amount, setAmount] = useState("");
    const [gcashRefId, setGcashRefId] = useState("");
    const [proofFile, setProofFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setProofFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !gcashRefId || !proofFile) {
            toast.error("All fields are required.");
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("amount", amount);
        formData.append("gcashRefId", gcashRefId);
        formData.append("proofFile", proofFile);
        formData.append("selectedPayments", JSON.stringify(selectedPayments)); 
    
        try {
            const response = await axios.post("/api/payments/proof-of-payment", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(response.data.message);
            navigate("/profile/dashboard");
        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error("Error submitting proof of payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
            <ToastContainer />
            <h2 className="text-3xl font-bold mb-8 text-center">Proof of Payment</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium mb-2">Amount</label>
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter payment amount"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-2">Reference ID</label>
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={gcashRefId}
                        onChange={(e) => setGcashRefId(e.target.value)}
                        placeholder="Enter reference ID"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-2">Upload Proof of Payment</label>
                    <input
                        type="file"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center text-lg"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <FaSpinner className="animate-spin mr-2" /> Submitting...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <FaCheckCircle className="mr-2" /> Submit Proof
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProofOfPayment;
