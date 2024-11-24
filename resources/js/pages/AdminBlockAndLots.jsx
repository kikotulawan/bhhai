import BlockAndLotTable  from '../components/BlockAndLotTable';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminBlockAndLots = () => {
    return (
        <div className="p-6">
            <ToastContainer />
            <div>
                <h1 className="text-2xl font-bold mb-6">Block and Lots</h1>
                <BlockAndLotTable />
            </div>
        </div>
    );
};

export default AdminBlockAndLots;
