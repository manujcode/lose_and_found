import React, { useState, useEffect } from 'react';
import { databases, storage } from '../appwrite';
import { Query } from 'appwrite';

const AdminItemManager = ({ user }) => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lost'); // 'lost' or 'found'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        // Fetch lost items
        const lostResponse = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
          [Query.orderDesc('$createdAt')]
        );
        
        // Fetch found items
        const foundResponse = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
          [Query.orderDesc('$createdAt')]
        );
        
        setLostItems(lostResponse.documents);
        setFoundItems(foundResponse.documents);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [deleteSuccess]);

  const handleDeleteItem = async (id, type) => {
    try {
      const collectionId = type === 'lost' 
        ? import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID 
        : import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID;
      
      // First, get the item to access its image URL
      const item = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        collectionId,
        id
      );

      // Delete the image from storage if it exists
      if (item.imageUrl) {
        try {
          // Extract the file ID from the image URL
          // The URL format is typically: https://cloud.appwrite.io/v1/storage/buckets/[BUCKET_ID]/files/[FILE_ID]/view
          const imageUrlParts = item.imageUrl.split('/');
          const fileId = imageUrlParts[imageUrlParts.length - 2]; // Get the file ID from the URL

          await storage.deleteFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            fileId
          );
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }

      // Delete all comments associated with this item
      try {
        const commentsResponse = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID,
          [Query.equal('productId', id)]
        );

        // Delete each comment
        for (const comment of commentsResponse.documents) {
          await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID,
            comment.$id
          );
        }
      } catch (error) {
        console.error('Error deleting comments:', error);
      }

      // Finally, delete the item itself
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        collectionId,
        id
      );
      
      setDeleteSuccess(true);
      setDeleteConfirm(null);

      // Reset the success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
      setDeleteError('Failed to delete item. Please try again.');
      
      // Reset the error message after 3 seconds
      setTimeout(() => {
        setDeleteError('');
      }, 3000);
    }
  };

  // Filter items based on search term and category
  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || item.tags === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const filteredLostItems = filterItems(lostItems);
  const filteredFoundItems = filterItems(foundItems);
  
  const currentItems = activeTab === 'lost' ? filteredLostItems : filteredFoundItems;

  // Card view for mobile screens
  const renderMobileCard = (item) => (
    <div key={item.$id} className="bg-gray-800/40 p-4 rounded-lg mb-4 shadow-md">
      <div className="flex items-start mb-3">
        <div className="h-16 w-16 mr-3 flex-shrink-0">
          {item.imageUrl ? (
            <img
              className="h-16 w-16 rounded-md object-cover"
              src={item.imageUrl}
              alt={item.title}
            />
          ) : (
            <div className="h-16 w-16 rounded-md bg-gray-700 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg">{item.title}</h3>
          <p className="text-gray-400 text-sm">{item.tags}</p>
        </div>
        <div className="text-right">
          <span className={`rounded-full px-2 py-1 text-xs ${
            activeTab === 'lost' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
          }`}>
            {activeTab === 'lost' ? 'Lost' : 'Found'}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-700 my-3 pt-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-gray-400 text-xs">Location</p>
            <p className="text-white text-sm">{item.location}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Color</p>
            <p className="text-white text-sm">{item.color}</p>
          </div>
        </div>
        
        <p className="text-gray-400 text-xs">Description</p>
        <p className="text-white text-sm line-clamp-2 mb-3">{item.description}</p>
        
        <div className="bg-gray-800/80 p-2 rounded mb-3">
          <p className="text-gray-300 text-sm font-medium">{item.name}</p>
          <p className="text-gray-400 text-xs">{item.email}</p>
          <p className="text-gray-400 text-xs">{item.phone}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-xs">
            {new Date(item.$createdAt).toLocaleDateString()} {new Date(item.$createdAt).toLocaleTimeString()}
          </div>
          
          {deleteConfirm === item.$id ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleDeleteItem(item.$id, activeTab)}
                className="px-3 py-1 bg-red-600/30 text-red-300 rounded-md text-sm hover:bg-red-600/50"
              >
                Confirm
              </button>
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setDeleteConfirm(item.$id)}
              className="px-3 py-1 bg-red-600/20 text-red-300 rounded-md text-sm hover:bg-red-600/40"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-purple-500">
          Admin Item Manager
        </h1>
        
        {/* Tabs */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-gray-800 p-1 rounded-lg inline-flex items-center">
            <button
              className={`px-3 sm:px-4 py-2 rounded-md text-sm ${
                activeTab === 'lost' 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('lost')}
            >
              Lost Items
            </button>
            <button
              className={`px-3 sm:px-4 py-2 rounded-md text-sm ${
                activeTab === 'found' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('found')}
            >
              Found Items
            </button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, description or name..."
              className="w-full px-3 py-2 text-sm bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              <option value="ID Card">ID Card</option>
              <option value="Bag">Bag</option>
              <option value="Mobile">Mobile Phone</option>
              <option value="Laptop">Laptop</option>
              <option value="Keys">Keys</option>
              <option value="Wallet">Wallet</option>
              <option value="Books">Books</option>
              <option value="Documents">Documents</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Water Bottle">Water Bottle</option>
              <option value="Accessories">Accessories</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {deleteSuccess && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg mb-4">
            Item deleted successfully!
          </div>
        )}
        
        {deleteError && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
            {deleteError}
          </div>
        )}
        
        {/* Mobile view (card layout) */}
        <div className="md:hidden">
          {currentItems.length > 0 ? (
            currentItems.map(item => renderMobileCard(item))
          ) : (
            <div className="bg-gray-800/40 p-4 rounded-lg text-center text-gray-400">
              {loading ? (
                <div className="flex justify-center items-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  <span className="ml-2">Loading items...</span>
                </div>
              ) : (
                `No ${activeTab} items found.`
              )}
            </div>
          )}
        </div>
        
        {/* Desktop view (table layout) */}
        <div className="hidden md:block bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.$id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              className="h-12 w-12 rounded-md object-cover"
                              src={item.imageUrl}
                              alt={item.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-700 flex items-center justify-center text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{item.title}</div>
                          <div className="text-sm text-gray-400">{item.tags}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{item.location}</div>
                      <div className="text-sm text-gray-400">Color: {item.color}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.email}</div>
                      <div className="text-sm text-gray-400">{item.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(item.$createdAt).toLocaleDateString()} 
                      <div className="text-xs text-gray-500">
                        {new Date(item.$createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {deleteConfirm === item.$id ? (
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            onClick={() => handleDeleteItem(item.$id, activeTab)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirm(item.$id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                        <span className="ml-2">Loading items...</span>
                      </div>
                    ) : (
                      `No ${activeTab} items found.`
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Item Count */}
        <div className="mt-4 text-right text-sm text-gray-400">
          {currentItems.length} items • {activeTab === 'lost' ? 'Lost' : 'Found'} items
        </div>
      </div>
    </div>
  );
};

export default AdminItemManager; 