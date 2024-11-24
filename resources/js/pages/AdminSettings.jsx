import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AdminSettings = () => {
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [accountNumber, setAccountNumber] = useState("");

    const fetchMonthlyPaymentAmount = async () => {
        try {
            const response = await axios.get(`/api/settings/monthly-payment`);
            setMonthlyPayment(response.data.monthly_payment);
            setAccountNumber(response.data.account_number);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const updateSettings = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/settings/update`, {account_number: accountNumber, monthly_payment: monthlyPayment});
            toast.success('Your settings have been updated')
        } catch (error) {
            console.error("Error fetching payments:", error);
            toast.error('Update settings failed')
        }
    };
    
    useEffect(() => {
        fetchMonthlyPaymentAmount();
    }, []);
    
    return (
        <div className="p-6">
            <ToastContainer />
            <div>
                <h1 className="text-2xl font-bold mb-6">System Settings</h1>
                <form onSubmit={updateSettings} className="w-full p-5 rounded-lg shadow-lg max-w-xl bg-white flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <label for="monthlyPayment">Monthly Payment (PHP)</label>
                        <input required type="number" id="monthlyPayment" value={monthlyPayment} onInput={(e) => setMonthlyPayment(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label for="accountNumber">Gcash Account Number</label>
                        <input required type="text" id="accountNumber" value={accountNumber}  onInput={(e) => setAccountNumber(e.target.value)} />
                    </div>
                    <button  className="bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-500 active:scale-95 transition-all">Update Settings</button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
