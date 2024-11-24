import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { uploadResidents, fetchAllResidents } from "../api/user";
import Pagination from "../components/pagination";
import { useLocation } from 'react-router-dom';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';
import Breadcrumbs from '../components/Breadcrumbs';
import Toast from '../components/Toast';


function ResidentTable() {
  const [residentData, setResidentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation(); 
  const crumbs = getBreadcrumbs(location);
  const [successMessage, setSuccessMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showImportLoader, setShowImportLoader] = useState(false);

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
        (record) => record.residency_status.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, roleFilter, residentData]);

  // Pagination Logic
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Handlers
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleRoleFilterChange = (e) => setRoleFilter(e.target.value);
  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileUpload = async (file) => {
    if (!(file instanceof Blob)) {
      console.error("The provided file is not a Blob.");
      setSuccessMessage("Invalid file format.");
      setShowToast(true);
  
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
        setSuccessMessage('');
      }, 3000);
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      const validData = jsonData.filter((record) => {
        const firstName = record.firstName ? record.firstName.toString().trim() : "";
        const lastName = record.lastName ? record.lastName.toString().trim() : "";
        const address = record.address ? record.address.toString().trim() : "";
        const residency_status = record.residency_status ? record.residency_status.toString().trim() : "";
        return firstName !== "" && lastName !== "" && address !== "" && residency_status !== "";
      });
  
      setResidentData(validData);
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        setShowImportLoader(true)
        const response = await uploadResidents(formData);
  
        // Show success toast
        setSuccessMessage(response.message || "Residents successfully uploaded!");
        setShowToast(true);
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
          setSuccessMessage('');
        }, 3000);
  
        // Fetch updated resident data
        const updatedResponse = await fetchAllResidents();
        if (Array.isArray(updatedResponse.data)) {
          setResidentData(updatedResponse.data);
        }
      } catch (error) {
        console.error("Error uploading residents:", error);
  
        // Show error toast
        setSuccessMessage("Error uploading residents. Please try again.");
        setShowToast(true);
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
          setSuccessMessage('');
        }, 3000);
      } finally {
        setShowImportLoader(false)
      }
    };
    reader.readAsArrayBuffer(file);
  };
  
  return (
    <div className=" min-h-screen relative overflow-x-auto shadow-md sm:rounded-md p-4 bg-[#FAFAFA]">
      {showImportLoader &&
        <div className="p-10 fixed overflow-hidden inset-0 bg-white/70 flex flex-col justify-center items-center gap-3 z-[999]">
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#ff5a1f" stroke-linecap="round" stroke-linejoin="round" id="Loader-2--Streamline-Tabler" height="48" width="48"><path d="M7.5 1.875a5.625 5.625 0 1 0 5.625 5.625" stroke-width="1"></path></svg>
          <p className="font-semibold text-gray-600">Importing data, please refrain of clicking or reloading the page...</p>
        </div>
      }

      {showToast && (
        <Toast
          message={successMessage}
          type={successMessage.includes('Error') ? 'danger' : 'success'}
          onClose={() => setShowToast(false)}
        />
      )}

            <div className="bg-white rounded-sm mb-2">
                <Breadcrumbs crumbs={crumbs} />
            </div>

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

          {/* Upload File Button */}
          <input
            type="file"
            id="file-upload"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
              htmlFor="file-upload"
              className="cursor-pointer bg-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition duration-200 shadow-sm text-sm sm:text-base flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2 text-white" // Adjusted `mr-2` for proper spacing and text color to white
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" // Updated to use `currentColor` to match the text color
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5h7.586l-.293.293a1 1 0 0 0 1.414 1.414l2-2a1 1 0 0 0 0-1.414l-2-2a1 1 0 0 0-1.414 1.414l.293.293H4V9h5a2 2 0 0 0 2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              Import
            </label>
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
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Residency Status
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
                    className={`${index % 2 === 0 ? "bg-gray-50" : ""} hover:bg-gray-100`}
                    >
                    <td className="px-6 py-4 whitespace-nowrap">
                        {`${record.firstName} ${record.middleName || ""} ${record.middleInitial || ""} ${record.lastName}`.trim()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.block}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.lot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.role}</td>
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

export default ResidentTable;
