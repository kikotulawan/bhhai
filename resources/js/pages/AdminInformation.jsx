import React from 'react';

const AdminInformation = ({ user }) => {
  return (
    <div>
        <div className='bg-[#F3F4F6] rounded-sm '>
          <h3 className="text-center text-3xl font-semibold p-2 mb-4">Admin Information</h3>
         </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={user?.firstName || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Middle Name</label>
          <input
            type="text"
            value={user?.middleName || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={user?.lastName || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <input
            type="text"
            value={user?.gender || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="text"
            value={user?.contact_number || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Block</label>
          <input
            type="text"
            value={user?.block || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lot</label>
          <input
            type="text"
            value={user?.lot || 'N/A'}
            readOnly
            className="w-full border text-gray-500 bg-gray-100 border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInformation;
