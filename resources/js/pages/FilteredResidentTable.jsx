import React, { useState, useEffect } from "react";
import { fetchAllResidents } from "../api/user";
import Pagination from "../components/pagination";

function FilteredResidentTable() {
  const [residentData, setResidentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadResidents = async () => {
      try {
        const response = await fetchAllResidents();
        if (Array.isArray(response.data)) {
          setResidentData(response.data);
          setFilteredData(response.data);
        } else {
          console.error("Fetched data is not an array:", response.data);
          setResidentData([]);
        }
      } catch (error) {
        console.error("Error fetching residents:", error);
        setResidentData([]);
      }
    };

    loadResidents();
  }, []);

  // Filtering and Searching Logic
  useEffect(() => {
    let filtered = residentData;

    if (searchTerm) {
      filtered = filtered.filter((record) =>
        `${record.firstName} ${record.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(
        (record) =>
          record.residency_status.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, roleFilter, residentData]);

  // Pagination Logic
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Handlers
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleRoleFilterChange = (e) => setRoleFilter(e.target.value);
  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className=" relative overflow-x-auto  sm:rounded-md bg-white">
      <div className="bg-white rounded-md shadow-sm p-4">
        {/* Controls Section */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-1/2">
          <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
                </svg>
                <input
                type="text"
                placeholder="Search Residents"
                value={searchTerm}
                onChange={handleSearch}
                className="form-input w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
          </div>

          {/* Role Filter Dropdown */}
          <div className="flex items-center">
            <label htmlFor="roleFilter" className="mr-2">
              Filter by Status:
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="form-select border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="homeowner">Homeowner</option>
              <option value="renter">Renter</option>
            </select>
          </div>

          {/* Entries Per Page Dropdown */}
          <div className="flex items-center">
            <label htmlFor="entries" className="mr-2">
              Show
            </label>
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
            </select>
            <span className="ml-2">entries</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto border-y border-gray-300 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Residential Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((record, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${record.firstName} ${record.middleName || ""} ${
                      record.middleInitial || ""
                    } ${record.lastName}`.trim()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.residency_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.nameOfOwner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default FilteredResidentTable;
