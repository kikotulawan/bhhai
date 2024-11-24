import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fetchDetailsFamily, fetchDetailsFamilyTenants, setAccountHolder } from '../api/user';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';

const FamilyDetails = () => {
  const { id } = useParams();
  const [block, lot] = id ? id.split('-') : [null, null];
  const { state } = useLocation();
  const [family, setFamily] = useState(state?.family || null);
  const [tenants, setTenants] = useState({});
  const [currentAccountHolder, setCurrentAccountHolderState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const crumbs = getBreadcrumbs(location);

  // Helper function to get the current account holder from family data
  const getAccountHolder = (familyData) => {
    if (!familyData || !familyData.account_holder_id) return null;
    return familyData.members.find(member => member.id === familyData.account_holder_id) || null;
  };

  useEffect(() => {
    const loadFamilyDetails = async () => {
      if (!block || !lot) {
        setError("Block and Lot are undefined.");
        return;
      }

      setLoading(true); // Start loading
      setError(''); // Clear previous errors before loading new data
      try {
        const fetchedFamily = await fetchDetailsFamily(block, lot);
        const fetchedTenants = await fetchDetailsFamilyTenants(block, lot);

        if (fetchedFamily && typeof fetchedFamily === 'object') {
          setFamily(fetchedFamily); // Set the family data
          setTenants(fetchedTenants); 

          // Use the helper function to set the current account holder
          const accountHolder = getAccountHolder(fetchedFamily);
          setCurrentAccountHolderState(accountHolder ? accountHolder.id : null);

          setLoading(false); // End loading
        } else {
          setError('Invalid response format.');
          setLoading(false); // End loading on error
        }
      } catch (error) {
        console.error('Error loading family details:', error);
        setError('Error loading family details.');
        setLoading(false); // End loading on catch
      }
    };

    loadFamilyDetails();
  }, [block, lot]);

  const handleSetAccountHolder = async (newAccountHolderId) => {
    if (!family?.block || !family?.lot) {
      setError("Family Block and Lot are undefined.");
      return;
    }

    setLoading(true);
    setMessage(''); // Clear previous message
    setError(''); // Clear previous error

    try {
      const familyId = `${family.block}-${family.lot}`;
      await setAccountHolder(familyId, newAccountHolderId, currentAccountHolder);
      setMessage('Account holder updated successfully.');

      // Update the current account holder state
      setCurrentAccountHolderState(newAccountHolderId);

      // Re-fetch family details after updating account holder
      const updatedFamily = await fetchDetailsFamily(family.block, family.lot);
      const updatedTenants = await fetchDetailsFamilyTenants(family.block, family.lot);
      if (updatedFamily && typeof updatedFamily === 'object' && Array.isArray(updatedFamily.members)) {
        setFamily(updatedFamily);
        setTenants(updatedTenants); 

        // Use the helper function to update the account holder
        const accountHolder = getAccountHolder(updatedFamily);
        setCurrentAccountHolderState(accountHolder ? accountHolder.id : null);

        setError(''); // Clear error since we successfully updated and fetched new data
      } else {
        setError('Failed to reload updated family details.');
        setMessage(''); // Clear success message on error
      }
    } catch (error) {
      setError('Error updating account holder. Please try again.');
      setMessage(''); // Clear success message on catch
    } finally {
      setLoading(false);
    }
  };

  
  const changeAccountHolder = async (tenantId) => {
      try {
          setLoading(true);
          const response = await fetch(`/api/user/tenants/holder/${tenantId}`, {
              method: 'PUT',
          });
          
          await response.json();

          if (response.ok) {
            const updatedFamily = await fetchDetailsFamily(family.block, family.lot);
            const updatedTenants = await fetchDetailsFamilyTenants(family.block, family.lot);
            if (updatedFamily && typeof updatedFamily === 'object' && Array.isArray(updatedFamily.members)) {
              setFamily(updatedFamily);
              setTenants(updatedTenants); 
      
              // Use the helper function to update the account holder
              const accountHolder = getAccountHolder(updatedFamily);
              setCurrentAccountHolderState(accountHolder ? accountHolder.id : null);
      
              setError(''); // Clear error since we successfully updated and fetched new data
            } else {
              setError('Failed to reload updated family details.');
              setMessage(''); // Clear success message on error
            }
          } else {
              setError("Failed to update account holder");
              setMessage(''); // Clear success message on error
          }
      } catch (error) {
          setError("Error updating account holder");
          setMessage(''); // Clear success message on error
      } finally {
        setLoading(false)
      }
    };

  if (loading) {
    return <div>Loading family details...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-x-auto shadow-md sm:rounded-md p-4 bg-[#F3F4F6]">
      <div className="bg-white rounded-md mb-2">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <h1 className="text-center text-4xl font-bold p-4">Family Details</h1>

      {message && <div className="bg-green-500 text-white p-4 mb-4">{message}</div>}
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}

      <div className="mb-4">
        <label htmlFor="accountHolderSelect" className="block text-sm font-medium text-gray-700">
          Select Account Holder
        </label>
        <select
          id="accountHolderSelect"
          value={currentAccountHolder || ''}
          onChange={(e) => handleSetAccountHolder(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>
            Choose an account holder
          </option>
          {family?.members?.map((member) => (
            <option key={member.id} value={member.id}>
              {member.firstName} {member.middleName} {member.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Firstname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Middlename
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lastname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Holder
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(family?.members) && family.members.length > 0 ? (
              family.members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{member.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.middleName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.contact_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.id === currentAccountHolder ? (
                      <span className="text-green-500 font-bold">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h1 className="text-center text-4xl font-bold p-4 mt-10">Tenants</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Firstname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Middlename
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lastname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Holder
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(tenants?.tenants) && tenants.tenants.length > 0 ? (
              tenants.tenants.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{member.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.middleName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.contact_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className={`relative inline-flex items-center ${member.is_account_holder == 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          <input
                              type="checkbox"
                              className="sr-only"
                              checked={member.is_account_holder == 1}
                              disabled={member.is_account_holder == 1}
                              onChange={() => changeAccountHolder(member.id)}
                          />
                          <span className={`w-11 h-6  rounded-full ${
                                  member.is_account_holder == 1 ? ' bg-green-600' : 'bg-gray-200'
                              }`}></span>
                          <span
                              className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                                  member.is_account_holder == 1 ? 'transform translate-x-5 bg-blue-600' : ''
                              }`}
                          ></span>
                      </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <div className="text-center">Updating account holder...</div>}
    </div>
  );
};

export default FamilyDetails;
