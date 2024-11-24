import React, { useEffect, useState } from 'react';
import { fetchApprovedUsers } from '../api/user';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';
import axios from 'axios';

const HouseList = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const location = useLocation();
  const crumbs = getBreadcrumbs(location);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await fetchApprovedUsers();
        const groupedUsers = groupByBlockAndLot(users);
        const familiesWithAccountHolders = mapFamilies(groupedUsers);

        setApprovedUsers(familiesWithAccountHolders);
        setFilteredFamilies(familiesWithAccountHolders);

        const statuses = await fetchPaymentStatuses(familiesWithAccountHolders);
        setPaymentStatuses(statuses);
      } catch (error) {
        console.error('Error fetching approved users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchPaymentStatuses = async (families) => {
    try {
      const response = await axios.post('/api/fetch-payment-statuses', {
        families: families.map((family) => ({
          block: family.block,
          lot: family.lot,
        })),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment statuses:', error);
      return {};
    }
  };

  const groupByBlockAndLot = (users) => {
    const grouped = users.reduce((acc, user) => {
      const key = `${user.block}-${user.lot}`;
      if (!acc[key]) {
        acc[key] = {
          block: user.block,
          lot: user.lot,
          accountHolder: null,
          members: [],
        };
      }
      acc[key].members.push(user);
      if (user.is_account_holder === 1) {
        acc[key].accountHolder = user;
      }
      return acc;
    }, {});

    Object.values(grouped).forEach((family) => {
      if (!family.accountHolder) {
        family.accountHolder = family.members[0];
      }
    });

    return Object.values(grouped).sort((a, b) => {
      const blockA = parseInt(a.block);
      const blockB = parseInt(b.block);
      const lotA = parseInt(a.lot);
      const lotB = parseInt(b.lot);

      return blockA !== blockB ? blockA - blockB : lotA - lotB;
    });
  };

  const mapFamilies = (families) => {
    return families.map((family) => ({
      ...family,
      accountHolder: family.accountHolder || family.members[0],
    }));
  };

  const handleViewFamily = (family) => {
    if (family.block && family.lot) {
      navigate(`/family-details/${family.block}-${family.lot}`, { state: { family } });
    } else {
      console.error('Block and/or Lot are undefined. Navigation aborted.');
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = approvedUsers.filter((family) =>
        `${family.accountHolder ? family.accountHolder.firstName : ''} ${family.accountHolder ? family.accountHolder.lastName : ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredFamilies(filtered);
    } else {
      setFilteredFamilies(approvedUsers);
    }
  }, [searchQuery, approvedUsers]);

  const handleEntriesPerPageChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastFamily = currentPage * entriesPerPage;
  const indexOfFirstFamily = indexOfLastFamily - entriesPerPage;
  const currentFamilies = filteredFamilies.slice(indexOfFirstFamily, indexOfLastFamily);
  const totalPages = Math.ceil(filteredFamilies.length / entriesPerPage);
  const capitalizeFirstLetter = (string) => {
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-auto shadow-md sm:rounded-md p-4 bg-[#F3F4F6]">
      <div className="bg-white rounded-md mb-2">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <h1 className="text-center text-4xl font-bold p-4">House List</h1>

      <div className="mb-4 px-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search Account Holder"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="entries" className="mr-2">Show</label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={handleEntriesPerPageChange}
                className="form-select border border-gray-300 rounded"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="ml-2">entries</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Holder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentFamilies.map((family, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                {family.accountHolder ? capitalizeFirstLetter(`${family.accountHolder.firstName} ${family.accountHolder.lastName}`) : 'No Account Holder'}

                </td>
                <td className="px-6 py-4 whitespace-nowrap">{family.block}</td>
                <td className="px-6 py-4 whitespace-nowrap">{family.lot}</td>
                <td className="px-6 py-4 whitespace-nowrap">{family.members.length}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    onClick={() => handleViewFamily(family)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, handlePageChange }) => (
  <div className="flex justify-center mt-4 mb-2">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(index + 1)}
        className={`mx-1 px-3 py-1 border rounded-lg ${
          currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default HouseList;
