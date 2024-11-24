import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";

const PaymentTable = ({ type }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/${type}-payments?page=${page}&search=${search}`);
        const data = await response.json();
        setPayments(data.data);
        setTotalPages(data.last_page);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchPayments();
  }, [type, page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);  // Reset to first page when search changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${type}-payments?page=${page}&search=${search}`);
      const data = await response.json();
      setPayments(data.data);
      setTotalPages(data.last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedPayment) return toast.error("No payment selected.");
    try {
      const response = await fetch('/api/admin/payments/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_reference: selectedPayment.transaction_reference,
        }),
      });

      if (response.ok) {
        setPayments((prev) =>
          prev.map((payment) =>
            payment.id === selectedPayment.id
              ? { ...payment, is_approved: 1 }
              : payment
          )
        );
        toast.success("Payment approved");
        setIsApproveModalOpen(false);
        fetchPayments(); // Refetch the payments table after approval
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error("Payment approval failed");
    }
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectReason.trim()) return toast.error("Please indicate a reason");
    try {
      const response = await fetch('/api/admin/payments/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_reference: selectedPayment.transaction_reference,
          reject_reason: rejectReason,
        }),
      });

      if (response.ok) {
        setPayments((prev) =>
          prev.map((payment) =>
            payment.id === selectedPayment.id
              ? { ...payment, reject_reason: rejectReason, is_approved: 0 }
              : payment
          )
        );
        toast.success("Payment rejected");
        setIsRejectModalOpen(false);
        setRejectReason('');
        fetchPayments(); // Refetch the payments table after rejection
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error("Payment rejection failed");
    }
  };

  if (loading && !search) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by transaction reference or user"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-md shadow-sm"
        />
      </div>
      
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Transaction Reference</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Period Covered</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Proof of Payment</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
            {type == 'rejected' && 
                <th className="px-4 py-2 text-left text-sm font-semibold">Reject Reason</th>
            }
            {type == 'pending' && 
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="px-4 py-2 text-sm">{payment.transaction_reference}</td>
                <td className="px-4 py-2 text-sm">{payment.period_covered}</td>
                <td className="px-4 py-2 text-sm">PHP {payment.amount}</td>
                <td className="px-4 py-2 text-sm">
                    <a
                        href={`http://localhost:8000/storage/${payment.proof_of_payment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline"
                    >
                        View
                    </a>
                </td>
                <td className="px-4 py-2 text-sm">{payment.user.firstName} {payment.user.lastName}</td>
                  {type == 'pending' && payment.is_approved === 0 && (
                    <td className="px-4 py-2 text-sm">
                        <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                            onClick={() => {
                            setSelectedPayment(payment);
                            setIsApproveModalOpen(true);
                            }}
                        >
                            Approve
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                            onClick={() => {
                            setSelectedPayment(payment);
                            setIsRejectModalOpen(true);
                            }}
                        >
                            Reject
                        </button>
                        </div>
                    </td>
                )}
                {
                type == 'rejected' &&
                <td className="px-4 py-2 text-sm">{payment.reject_reason}</td>
                }
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={type == 'approved' ? '5' : '6'} className="text-center px-4 py-2 text-sm">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      {/* Approval Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Approve Payment</h3>
            <p>Are you sure you want to approve this payment?</p>
            <div className="mt-4 flex space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={handleApprove}
              >
                Yes, Approve
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                onClick={() => setIsApproveModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white p-6 rounded-md shadow-lg min-w-[500px]">
            <h3 className="text-lg font-semibold mb-4">Reject Payment</h3>
            <textarea
              placeholder="Enter reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="mt-4 flex space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleReject}
              >
                Yes, Reject
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                onClick={() => setIsRejectModalOpen(false)}
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

export default PaymentTable;
