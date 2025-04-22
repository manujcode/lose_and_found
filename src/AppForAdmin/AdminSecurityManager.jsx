import React, { useState, useEffect } from 'react';
import { Client, Databases, Query, ID } from 'appwrite';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const AdminSecurityManager = ({ user }) => {
  const [securityGuards, setSecurityGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [formData, setFormData] = useState({
    email: user.email,
    security_email: ''
  });
  const [error, setError] = useState('');

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  const databases = new Databases(client);
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const securityGuardsCollectionId = import.meta.env.VITE_APPWRITE_SECURITY_GUARDS_COLLECTION_ID;

  useEffect(() => {
    fetchSecurityGuards();
  }, []);

  const fetchSecurityGuards = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        databaseId,
        securityGuardsCollectionId
      );
      
      setSecurityGuards(response.documents);
    } catch (error) {
      console.error('Error fetching security guards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const resetForm = () => {
    setFormData({
      email: user.email,
      security_email: ''
    });
    setError('');
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (guard) => {
    setSelectedGuard(guard);
    setFormData({
      email: guard.email || user.email,
      security_email: guard.security_email || ''
    });
    setError('');
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    resetForm();
  };

  // Check if security_email already exists in the database
  const checkSecurityEmailExists = async (email, excludeId = null) => {
    try {
      const queries = [Query.equal('security_email', email)];
      
      // If we're updating a record, exclude the current record from the check
      if (excludeId) {
        queries.push(Query.notEqual('$id', excludeId));
      }
      
      const response = await databases.listDocuments(
        databaseId,
        securityGuardsCollectionId,
        queries
      );
      
      return response.documents.length > 0;
    } catch (error) {
      console.error('Error checking security email existence:', error);
      return false;
    }
  };

  const handleAddGuard = async (e) => {
    e.preventDefault();
    
    try {
      // Check if security_email already exists
      const emailExists = await checkSecurityEmailExists(formData.security_email);
      
      if (emailExists) {
        setError('This security email is already registered. Please use a different email.');
        return;
      }
      
      await databases.createDocument(
        databaseId,
        securityGuardsCollectionId,
        ID.unique(),
        {
          ...formData,
        }
      );
      closeModals();
      fetchSecurityGuards();
    } catch (error) {
      console.error('Error adding security guard:', error);
      setError('Failed to add security guard. Please try again.');
    }
  };

  const handleUpdateGuard = async (e) => {
    e.preventDefault();
    if (!selectedGuard) return;
    
    try {
      // If the email is changing, check if the new email already exists
      if (formData.security_email !== selectedGuard.security_email) {
        const emailExists = await checkSecurityEmailExists(formData.security_email, selectedGuard.$id);
        
        if (emailExists) {
          setError('This security email is already registered. Please use a different email.');
          return;
        }
      }
      
      await databases.updateDocument(
        databaseId,
        securityGuardsCollectionId,
        selectedGuard.$id,
        {
          ...formData,
        }
      );
      closeModals();
      fetchSecurityGuards();
    } catch (error) {
      console.error('Error updating security guard:', error);
      setError('Failed to update security guard. Please try again.');
    }
  };

  const handleDeleteGuard = async (guardId) => {
    if (!window.confirm('Are you sure you want to delete this security guard?')) return;
    
    try {
      await databases.deleteDocument(
        databaseId,
        securityGuardsCollectionId,
        guardId
      );
      fetchSecurityGuards();
    } catch (error) {
      console.error('Error deleting security guard:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-white">Security Guard Management</h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <FaPlus className="text-sm" /> Add Security Guard
          </button>
        </div>
        <p className="text-gray-400 mt-2">
          Manage security guard emails for system access
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {securityGuards.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 mb-4">No security guards found</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <FaPlus className="text-sm" /> Add Your First Security Guard
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Admin Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Security Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {securityGuards.map((guard) => (
                    <tr key={guard.$id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{guard.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{guard.security_email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(guard)}
                            className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteGuard(guard.$id)}
                            className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Security Guard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Add New Security Guard</h3>
            </div>
            <form onSubmit={handleAddGuard}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="block text-sm font-medium text-gray-300 mb-1">
                    Admin Email: <span className="text-gray-400">{user.email}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Security Email *
                  </label>
                  <input
                    type="email"
                    name="security_email"
                    value={formData.security_email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter security guard email"
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-900/50 text-red-300 px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-750 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModals}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Add Security Guard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Security Guard Modal */}
      {showEditModal && selectedGuard && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Edit Security Guard</h3>
            </div>
            <form onSubmit={handleUpdateGuard}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="block text-sm font-medium text-gray-300 mb-1">
                    Admin Email: <span className="text-gray-400">{selectedGuard.email}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Security Email *
                  </label>
                  <input
                    type="email"
                    name="security_email"
                    value={formData.security_email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter security guard email"
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-900/50 text-red-300 px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-750 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModals}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Update Security Guard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSecurityManager; 