import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';

const MyUploads = ({ user }) => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lost', or 'found'
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [disableReason, setDisableReason] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = async () => {
    setLoading(true);
    try {
      // Fetch lost items
      const lostResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
        [Query.equal('email', user.email)]
      );
      
      // Fetch found items
      const foundResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
        [Query.equal('email', user.email)]
      );
      
      setLostItems(lostResponse.documents);
      setFoundItems(foundResponse.documents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user items:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (itemId, isLost) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const collectionId = isLost 
          ? import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID
          : import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID;
          
        await databases.deleteDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          collectionId,
          itemId
        );
        
        if (isLost) {
          setLostItems(lostItems.filter(item => item.$id !== itemId));
        } else {
          setFoundItems(foundItems.filter(item => item.$id !== itemId));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const openDisableModal = (item) => {
    setCurrentItem(item);
    setDisableReason(item.Disabled_reason || '');
    setShowDisableModal(true);
  };

  const handleDisableSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentItem) return;
    
    try {
      const newDisabledState = !currentItem.Disabled;
      
      // Update both Disabled state and reason
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
        currentItem.$id,
        { 
          Disabled: newDisabledState,
          Disabled_reason: newDisabledState ? disableReason : ''
        }
      );
      
      // Update the local state
      setLostItems(lostItems.map(lostItem => 
        lostItem.$id === currentItem.$id 
          ? { 
              ...lostItem, 
              Disabled: newDisabledState,
              Disabled_reason: newDisabledState ? disableReason : ''
            } 
          : lostItem
      ));
      
      // Close the modal and reset fields
      setShowDisableModal(false);
      setCurrentItem(null);
      setDisableReason('');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const toggleDisabled = async (item) => {
    // If enabling an item, don't show the modal
    if (item.Disabled) {
      try {
        await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
          item.$id,
          { 
            Disabled: false,
            Disabled_reason: ''
          }
        );
        
        // Update the local state
        setLostItems(lostItems.map(lostItem => 
          lostItem.$id === item.$id 
            ? { ...lostItem, Disabled: false, Disabled_reason: '' } 
            : lostItem
        ));
      } catch (error) {
        console.error('Error updating item:', error);
      }
    } else {
      // If disabling, show the modal to enter a reason
      openDisableModal(item);
    }
  };

  // Filter items based on active tab
  const getFilteredItems = () => {
    if (activeTab === 'lost') return lostItems;
    if (activeTab === 'found') return foundItems;
    return [...lostItems, ...foundItems].sort((a, b) => 
      new Date(b.$createdAt) - new Date(a.$createdAt)
    );
  };

  const items = getFilteredItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-red-500">My Dashboard</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 
              ${activeTab === 'all' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
          >
            All Items ({lostItems.length + foundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 
              ${activeTab === 'lost' 
                ? 'bg-red-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
          >
            Lost Items ({lostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 
              ${activeTab === 'found' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
          >
            Found Items ({foundItems.length})
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-gray-300 mt-8">
            <p className="text-xl mb-4">No items in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const isLost = lostItems.some(lostItem => lostItem.$id === item.$id);
              return (
                <div
                  key={item.$id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer 
                    ${isLost && item.Disabled ? 'opacity-60' : ''}`}
                  // onClick={() => navigate(`/${isLost ? 'lost' : 'found'}/${item.$id}`)}
                >
                  <div className="relative h-48">
                    {item.imageUrl ? (
                      <a 
                        href={item.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block h-full w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No Image Available</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${isLost ? 'bg-red-500' : 'bg-green-500'}`}>
                        {isLost ? 'Lost' : 'Found'}
                      </span>
                      {isLost && item.Disabled && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gray-500">
                          Disabled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      {item.title}
                    </h2>
                    
                    <div className="space-y-3 text-sm text-gray-600 mb-4">
                      {item.description && (
                        <p className="text-gray-600">
                          {item.description.length > 100 
                            ? item.description.substring(0, 100) + '...' 
                            : item.description}
                        </p>
                      )}
                      
                      {isLost && item.Disabled && item.Disabled_reason && (
                        <div className="bg-red-50 border border-red-100 rounded-md p-2">
                          <p className="text-xs text-gray-500 font-medium mb-1">Reason for disabling:</p>
                          <p className="text-sm text-gray-700">{item.Disabled_reason}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <span className="text-xs text-gray-500 block">Location</span>
                            <span className="truncate block">{item.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <span className="text-xs text-gray-500 block">Date</span>
                            <span>{new Date(item.$createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {item.color && (
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            <div>
                              <span className="text-xs text-gray-500 block">Color</span>
                              <span>{item.color}</span>
                            </div>
                          </div>
                        )}
                        
                        {item.tags && (
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <div>
                              <span className="text-xs text-gray-500 block">Category</span>
                              <span>{item.tags}</span>
                            </div>
                          </div>
                        )}
                        
                        {item.course && (
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <div>
                              <span className="text-xs text-gray-500 block">Course</span>
                              <span>{item.course}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end items-center border-t border-gray-100 pt-3">
                      {isLost ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDisabled(item);
                          }}
                          className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 flex items-center 
                            ${item.Disabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.Disabled 
                              ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                              : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} 
                            />
                          </svg>
                          {item.Disabled ? 'Enable' : 'Disable'}
                        </button>
                      ) : (
                        <div className="text-xs text-gray-500 italic">
                          Found items cannot be modified
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disable Modal */}
        {showDisableModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Disable Item</h3>
              <form onSubmit={handleDisableSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="disableReason">
                    Reason for disabling
                  </label>
                  <textarea
                    id="disableReason"
                    value={disableReason}
                    onChange={(e) => setDisableReason(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter the reason why you're disabling this item..."
                    rows="4"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisableModal(false);
                      setCurrentItem(null);
                      setDisableReason('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Disable Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUploads; 