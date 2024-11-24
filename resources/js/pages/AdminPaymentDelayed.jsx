import DelayedPaymentTable  from '../components/DelayedPaymentTable';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPaymentDelayed = () => {
    return (
        <div className="p-6">
            <ToastContainer />
            <div>
                <h1 className="text-2xl font-bold mb-6">Delayed Payments</h1>
                <DelayedPaymentTable />
            </div>
        </div>
    );
};

export default AdminPaymentDelayed;
