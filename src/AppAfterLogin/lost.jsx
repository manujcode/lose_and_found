import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import SingleLostItem from './singleLostItem';

const Lost = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
          [Query.orderDesc('$createdAt')]
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

  const handleClick = (id) => {
    setSelectedItem(id);
  };

  if (selectedItem) {
    return <SingleLostItem id={selectedItem} setSelectedItem={setSelectedItem} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl underline font-bold text-center mb-6 sm:mb-8 text-red-500">
          Lost Items
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div 
              key={item.$id} 
              onClick={() => handleClick(item.$id)} 
              className="bg-white cursor-pointer rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                    Lost
                  </span>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl flex text-gray-800 font-medium mb-2">
                  <span className="font-bold">Title -&nbsp;</span>
                  <span className="truncate">{item.title}</span>
                </h2>
                
                <p className="flex text-sm sm:text-base text-gray-600 mb-2">
                  <span className="font-bold">Color -&nbsp;</span>
                  <span>{item.color}</span>
                </p>
              
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-800 mb-3">
                  <span className="flex items-center mb-1 sm:mb-0">
                    <span className="font-bold mr-1">Last seen:&nbsp;</span>
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    {new Date(item.$createdAt).toLocaleDateString()}
                  </span>
                </div>

                
                
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <span className="text-red-600 font-medium text-sm sm:text-base">
                    Posted by: {item.name}
                  </span>
                  <button 
                    className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 text-sm sm:text-base"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${item.phone}`;
                    }}
                  >
                    {item.phone}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center text-gray-300 mt-8 text-lg">
            No lost items reported
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lost;
