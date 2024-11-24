import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SpamNotificationToggle from './SpamNotificationToggle'
import axios from "axios";

const DelayedPaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/delayed-payments?search=${search}&page=${page}`);
      const data = await response.json();
      setPayments(data.data);
      setTotalPages(data.last_page);
    } catch (error) {
      console.error('Error fetching delayed payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page when search changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by reference or user"
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm"
        />
        <SpamNotificationToggle />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="loader" />
        </div>
      ) : payments.length > 0 ? (
        <div>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Year</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Month</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{payment.year}</td>
                  <td className="px-4 py-2 text-sm">{payment.month}</td>
                  <td className="px-4 py-2 text-sm">
                    {payment.user?.firstName} {payment.user?.lastName}
                  </td>
                </tr>
              ))}
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
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">No delayed payments found</div>
      )}
    </div>
  );
};

export default DelayedPaymentTable;
