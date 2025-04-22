import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';

const AppForSecurityGuard = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOwnerReceivedModal, setShowOwnerReceivedModal] = useState(false);
  const [showReverseOwnerModal, setShowReverseOwnerModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [ownerReceivedDetails, setOwnerReceivedDetails] = useState('');
  const [reverseOwnerReason, setReverseOwnerReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'disabled', 'guard_received', 'owner_received'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID
        );
        setItems(response.documents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleOwnerAction = (item) => {
    // If already marked as received by owner, show reverse modal
    if (item.owner_received) {
      handleReverseOwnerModal(item);
    } else {
      // Otherwise show the normal modal to mark as received
      handleOwnerReceivedModal(item);
    }
  };

  const handleOwnerReceivedModal = (item) => {
    setSelectedItem(item);
    setShowOwnerReceivedModal(true);
  };

  const handleReverseOwnerModal = (item) => {
    setSelectedItem(item);
    setShowReverseOwnerModal(true);
  };
  
  const handleReverseOwnerSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        owner_received: false,
        guard_remarks: reverseOwnerReason
      };
      
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
        selectedItem.$id,
        updateData
      );
      
      // Update local state
      setItems(items.map(item => 
        item.$id === selectedItem.$id 
          ? { ...item, ...updateData } 
          : item
      ));
      
      setShowReverseOwnerModal(false);
      setReverseOwnerReason('');
      setSelectedItem(null);
      alert('Owner receipt status reversed successfully!');
    } catch (error) {
      console.error('Error updating owner receipt status:', error);
      alert(`Failed to reverse owner receipt status. Please try again.`);
    }
  };
  
  const handleDirectAction = async (item, actionType) => {
    try {
      let updateData = {};
      let successMessage = '';
      
      switch(actionType) {
        case 'enable':
          updateData = {
            // isActive: true,
            Disabled: false,
            // Disabled_reason: '',
            // statusChangedBy: user.email,
            // statusChangedAt: new Date().toISOString()
          };
          successMessage = 'Item enabled successfully!';
          break;
          
        case 'toggle_guard_received':
          // Toggle the guard_received value
          const newGuardReceivedValue = !(item.guard_received === true);
          updateData = {
            guard_received: newGuardReceivedValue,
            // guard_received_notes: newGuardReceivedValue 
            //   ? `Item stored by ${user.email} on ${new Date().toLocaleString()}` 
            //   : `Item storage status reversed by ${user.email} on ${new Date().toLocaleString()}`
          };
          successMessage = newGuardReceivedValue 
            ? 'Item marked as stored successfully!' 
            : 'Item storage status reversed successfully!';
          break;

        case 'disable':
            const newDisabledValue = !(item.Disabled === true);
            console.log(newDisabledValue)
          updateData = {
            // isActive: false,
            Disabled: newDisabledValue,
            // Disabled_reason: `Disabled by ${user.email} on ${new Date().toLocaleString()}`,
            // statusChangedBy: user.email,
            // statusChangedAt: new Date().toISOString()
          };
          successMessage = newDisabledValue 
            ? 'Item disabled successfully!' 
            : 'Item enabled successfully!';
          break;
      }
      
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
        item.$id,
        updateData
      );
      
      // Update local state
      setItems(items.map(i => 
        i.$id === item.$id 
          ? { ...i, ...updateData } 
          : i
      ));
      
      alert(successMessage);
    } catch (error) {
      console.error('Error updating item status:', error);
      alert(`Failed to update item status. Please try again.`);
    }
  };
  
  const handleOwnerReceivedSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        owner_received: true,
        // owner_received_at: new Date().toISOString(),
        // owner_received_by: user.email,
        guard_remarks: ownerReceivedDetails
      };
      
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
        selectedItem.$id,
        updateData
      );
      
      // Update local state
      setItems(items.map(item => 
        item.$id === selectedItem.$id 
          ? { ...item, ...updateData } 
          : item
      ));
      
      setShowOwnerReceivedModal(false);
      setOwnerReceivedDetails('');
      setSelectedItem(null);
      alert('Item marked as received by owner successfully!');
    } catch (error) {
      console.error('Error updating owner received status:', error);
      alert(`Failed to mark as received by owner. Please try again.`);
    }
  };

  const getFilteredItems = () => {
    return items.filter(item => {
      // Apply search filter
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply status filter
      let matchesStatus = true;
      switch(filterStatus) {
        case 'active':
          matchesStatus = item.isActive !== false;
          break;
        case 'disabled':
          matchesStatus = item.isActive === false || item.Disabled === true;
          break;
        case 'guard_received':
          matchesStatus = item.guard_received === true;
          break;
        case 'owner_received':
          matchesStatus = item.owner_received === true;
          break;
      }
      
      return matchesSearch && matchesStatus;
    })
    // Sort items by creation date - newest first
    .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getItemStatus = (item) => {
    if (item.owner_received) return 'Owner Received';
    if (item.guard_received) return 'Guard Received';
    if (item.isActive === false || item.Disabled === true) return 'Disabled';
    return 'Active';
  };

  const getStatusColor = (item) => {
    if (item.owner_received) return 'bg-purple-100 text-purple-800';
    if (item.guard_received) return 'bg-blue-100 text-blue-800';
    if (item.isActive === false || item.Disabled === true) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  // Helper to render a checkbox
  const StatusCheckbox = ({ isChecked, label }) => (
    <div className="flex items-center">
      <div className={`mr-2 w-4 h-4 flex items-center justify-center rounded border ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
        {isChecked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
      <span>{label}</span>
    </div>
  );

  const handleViewDetails = (item) => {
    setDetailItem(item);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="pb-5 border-b border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security Guard Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage found items by updating their status as needed.
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Search items by title, description or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-none">
            <select
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="active">Active Items</option>
              <option value="disabled">Disabled Items</option>
              <option value="guard_received">Guard Received Items</option>
              <option value="owner_received">Owner Received Items</option>
            </select>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Found Items
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {items.length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Active Items
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {items.filter(item => item.isActive !== false && !item.Disabled).length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Guard Received
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">
                {items.filter(item => item.guard_received === true).length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Owner Received
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-purple-600">
                {items.filter(item => item.owner_received === true).length}
              </dd>
            </div>
          </div>
        </div>
        
        {/* Items Table */}
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Found
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item.$id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {item.imageUrl ? (
                                  <img className="h-10 w-10 rounded-full object-cover" src={item.imageUrl} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.location || 'Not specified'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(item.$createdAt).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{new Date(item.$createdAt).toLocaleTimeString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item)}`}>
                              {getItemStatus(item)}
                            </span>
                            {item.statusChangedBy && (
                              <div className="text-xs text-gray-500 mt-1">
                                by {item.statusChangedBy}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                            <div className="flex flex-col space-y-2">
                              {/* Status update buttons */}
                              {(!item.Disabled || !item.guard_received || !item.owner_received) && (
                                <>
                                 {item.owner_received && item.guard_received && <button
                                    onClick={() => handleDirectAction(item, 'disable')}
                                    // disabled={item.Disabled}
                                    className={`inline-flex items-center px-3 py-2 border text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    ${item.Disabled 
                                      ? 'bg-green-100 text-green-800 border-green-200 cursor-default' 
                                      : 'text-white bg-red-600 hover:bg-red-700 border-transparent focus:ring-red-500'}`}
                                  >
                                    <StatusCheckbox isChecked={item.Disabled} label={item.Disabled ? "Undo Disable" : "Mark as Disabled"} />
                                  </button>}
                                  
                                  <button
                                    onClick={() => handleDirectAction(item, 'toggle_guard_received')}
                                    className={`inline-flex items-center px-3 py-2 border text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    ${item.guard_received
                                      ? 'bg-green-100 text-blue-800 border-green-200 hover:bg-blue-50' 
                                      : 'text-white bg-blue-600 hover:bg-blue-700 border-transparent focus:ring-blue-500'}`}
                                  >
                                    <StatusCheckbox isChecked={item.guard_received} label={item.guard_received ? "Undo Item Storage" : "Item Stored"} />
                                  </button>
                                  
                                  {item.guard_received && (
                                    <button
                                      onClick={() => handleOwnerAction(item)}
                                      className={`inline-flex items-center px-3 py-2 border text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
                                      ${item.owner_received 
                                        ? 'bg-green-100 text-purple-800 border-green-200 hover:bg-purple-50' 
                                        : 'text-white bg-purple-600 hover:bg-purple-700 border-transparent focus:ring-purple-500'}`}
                                    >
                                      <StatusCheckbox isChecked={item.owner_received} label={item.owner_received ? "Undo Owner Receipt" : "Owner Received"} />
                                    </button>
                                  )}
                                </>
                              )}
                              
                              <button
                                onClick={() => handleViewDetails(item)}
                                className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                          No items found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Pagination controls after the table */}
        {filteredItems.length > itemsPerPage && (
          <div className="mt-4 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show only current page, previous, next, first and last pages
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber ? 'z-10 bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === currentPage - 2 && currentPage > 3) || 
                  (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Owner Received Modal */}
      {showOwnerReceivedModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Mark Item as Received by Owner
            </h2>
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12">
                  {selectedItem.imageUrl ? (
                    <img className="h-12 w-12 rounded-md object-cover" src={selectedItem.imageUrl} alt="" />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">{selectedItem.title}</h3>
                  <p className="text-xs text-gray-500">{selectedItem.location || 'No location specified'}</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleOwnerReceivedSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Receipt Details
                </label>
                <textarea
                  value={ownerReceivedDetails}
                  onChange={(e) => setOwnerReceivedDetails(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  required
                  placeholder="Please provide details about the owner who received this item (name, ID, contact, etc.)..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOwnerReceivedModal(false);
                    setSelectedItem(null);
                    setOwnerReceivedDetails('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md bg-purple-600 hover:bg-purple-700"
                >
                  Confirm Owner Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Reverse Owner Received Modal */}
      {showReverseOwnerModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Reverse Owner Receipt Status
            </h2>
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12">
                  {selectedItem.imageUrl ? (
                    <img className="h-12 w-12 rounded-md object-cover" src={selectedItem.imageUrl} alt="" />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">{selectedItem.title}</h3>
                  <p className="text-xs text-gray-500">{selectedItem.location || 'No location specified'}</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleReverseOwnerSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Reversing Owner Receipt
                </label>
                <textarea
                  value={reverseOwnerReason}
                  onChange={(e) => setReverseOwnerReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  required
                  placeholder="Please provide a reason for reversing the owner receipt status of this item..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowReverseOwnerModal(false);
                    setSelectedItem(null);
                    setReverseOwnerReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md bg-purple-600 hover:bg-purple-700"
                >
                  Confirm Reversal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Item Details Modal */}
      {showDetailsModal && detailItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">
                Item Details
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setDetailItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image */}
              <div className="sm:w-1/3">
                {detailItem.imageUrl ? (
                  <img 
                    src={detailItem.imageUrl} 
                    alt={detailItem.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md" 
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                    <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(detailItem)}`}>
                      {getItemStatus(detailItem)}
                    </span>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Date Reported</div>
                    <div className="text-sm text-gray-900">{new Date(detailItem.$createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              {/* Details */}
              <div className="sm:w-2/3">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{detailItem.title}</h3>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500">Description</div>
                  <p className="text-sm text-gray-900 mt-1">{detailItem.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Location Found</div>
                    <div className="text-sm text-gray-900">{detailItem.location || 'Not specified'}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">Color</div>
                    <div className="text-sm text-gray-900">{detailItem.color || 'Not specified'}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">Course</div>
                    <div className="text-sm text-gray-900">{detailItem.course || 'Not specified'}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">Tags</div>
                    <div className="text-sm text-gray-900">{detailItem.tags || 'Not specified'}</div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                    </svg>
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500">Reporter Email</div>
                      <div className="text-sm text-gray-900">{detailItem.email || 'Not provided'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Reporter Phone</div>
                      <div className="text-sm text-gray-900">{detailItem.phone || 'Not provided'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Reporter Name</div>
                      <div className="text-sm text-gray-900">{detailItem.name || detailItem.userName || 'Anonymous'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Status Timeline */}
                <div className="mb-4 pt-4 border-t border-gray-200">
                  <h4 className="text-md font-semibold mb-2">Status Timeline</h4>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full ${detailItem.guard_received ? 'bg-blue-500' : 'bg-gray-300'} mr-3 flex items-center justify-center`}>
                        {detailItem.guard_received && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${detailItem.guard_received ? 'text-gray-900' : 'text-gray-500'}`}>
                          Item Stored by Security
                        </div>
                        {detailItem.guard_received && (
                          <div className="text-xs text-gray-500">
                            {detailItem.guard_received_at ? new Date(detailItem.guard_received_at).toLocaleString() : 'Date not recorded'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full ${detailItem.owner_received ? 'bg-purple-500' : 'bg-gray-300'} mr-3 flex items-center justify-center`}>
                        {detailItem.owner_received && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${detailItem.owner_received ? 'text-gray-900' : 'text-gray-500'}`}>
                          Item Claimed by Owner
                        </div>
                        {detailItem.owner_received && (
                          <div className="text-xs text-gray-500">
                            {detailItem.owner_received_at ? new Date(detailItem.owner_received_at).toLocaleString() : 'Date not recorded'}
                            {detailItem.ownerReceivedDetails && (
                              <div className="mt-1 text-xs bg-purple-50 p-1.5 rounded border border-purple-100">
                                {detailItem.ownerReceivedDetails}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full ${detailItem.isActive === false || detailItem.Disabled ? 'bg-red-500' : 'bg-gray-300'} mr-3 flex items-center justify-center`}>
                        {(detailItem.isActive === false || detailItem.Disabled) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${detailItem.isActive === false || detailItem.Disabled ? 'text-gray-900' : 'text-gray-500'}`}>
                          Item Disabled
                        </div>
                        {(detailItem.isActive === false || detailItem.Disabled) && (
                          <div className="text-xs text-gray-500">
                            {detailItem.disabledAt ? new Date(detailItem.disabledAt).toLocaleString() : 'Date not recorded'}
                            {detailItem.disableReason && (
                              <div className="mt-1 text-xs bg-red-50 p-1.5 rounded border border-red-100">
                                {detailItem.disableReason}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Guard Remarks */}
                {detailItem.guard_remarks && (
                  <div className="mb-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-500 mb-1">Guard Remarks</div>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {detailItem.guard_remarks}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setDetailItem(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppForSecurityGuard; 