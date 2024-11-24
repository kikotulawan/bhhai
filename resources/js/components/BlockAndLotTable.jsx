import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BlockAndLotTable = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null); // For storing current block data for editing
  const [formData, setFormData] = useState({
    block: '',
    lot: '',
    status: ''
  });

  // Fetch blocks with pagination, search, and filter
  useEffect(() => {
    const fetchBlocks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/blocks-lots', {
          params: { search, status, page },
        });
        setBlocks(response.data.data);
        setTotalPages(response.data.last_page);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        toast.error('Failed to fetch blocks');
      }
      setLoading(false);
    };

    fetchBlocks();
  }, [search, status, page]);

  
  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blocks-lots', {
        params: { search, status, page },
      });
      setBlocks(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error fetching blocks:', error);
      toast.error('Failed to fetch blocks');
    }
    setLoading(false);
  };

  // Handle the delete operation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/blocks-lots/${id}`);
      setBlocks(blocks.filter(block => block.id !== id));
      toast.success('Block and Lot deleted successfully');
    } catch (error) {
      console.error('Error deleting block:', error);
      toast.error('Failed to delete block');
    }
  };

  // Handle opening the modal for creating a new block
  const openCreateModal = () => {
    setCurrentBlock(null);
    setFormData({ block: '', lot: '', status: '' });
    setShowModal(true);
  };

  // Handle opening the modal for updating an existing block
  const openUpdateModal = (block) => {
    setCurrentBlock(block);
    setFormData({ block: block.block, lot: block.lot, status: block.status });
    setShowModal(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission for both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { block, lot, status } = formData;

    try {
      if (currentBlock) {
        // Update existing block
        await axios.put(`/api/blocks-lots/${currentBlock.id}`, { status });
        toast.success('Block and Lot updated successfully');
      } else {
        // Create new block
        await axios.post('/api/blocks-lots', { block, status });
        toast.success('Block and Lot created successfully');
      }
      setShowModal(false);
      setPage(1); // Reset to first page after create/update
      fetchBlocks()
    } catch (error) {
      console.error('Error saving block:', error);
      toast.error('Failed to save block');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by block or lot"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm"
        >
          <option value="">Select Status</option>
          <option value="Unoccupied">Unoccupied</option>
          <option value="Occupied">Occupied</option>
        </select>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          New Block and Lot
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Block</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Lot</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center px-4 py-2 text-sm">Loading...</td>
            </tr>
          ) : blocks.length > 0 ? (
            blocks.map((block) => (
              <tr key={block.id} className="border-t">
                <td className="px-4 py-2 text-sm">{block.block}</td>
                <td className="px-4 py-2 text-sm">{block.lot}</td>
                <td className="px-4 py-2 text-sm">{block.status}</td>
                {/* <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => openUpdateModal(block)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center px-4 py-2 text-sm">No data available</td>
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

      {/* Modal for Create / Update */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl mb-4">{currentBlock ? 'Update Block and Lot' : 'Create Block and Lot'}</h2>
            <form onSubmit={handleSubmit}>
              {!currentBlock &&
                <div className="mb-4">
                  <label className="block text-sm font-medium">Block</label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              }
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {currentBlock ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockAndLotTable;
