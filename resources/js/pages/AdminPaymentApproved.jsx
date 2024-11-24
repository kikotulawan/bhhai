import PaymentTable  from '../components/PaymentTable';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPaymentApproved = () => {
    return (
        <div className="p-6">
            <ToastContainer />
            <div>
                <h1 className="text-2xl font-bold mb-6">Approved Payments</h1>
                <PaymentTable type="approved" />
            </div>
        </div>
    );
};

export default AdminPaymentApproved;
