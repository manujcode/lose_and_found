import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import SingleFoundItem from './singleFoundItem';

const Found = ({user}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =12;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
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

  const filteredItems = items.filter(item => {
    const matchesCourse = selectedCourse ? item.course === selectedCourse : true;
    const matchesTag = selectedTag ? item.tags === selectedTag : true;
    return matchesCourse && matchesTag;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (selectedItem) {
    return <SingleFoundItem user={user} id={selectedItem} setSelectedItem={setSelectedItem} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl underline font-bold text-center mb-6 sm:mb-8 text-green-500">
          Found Items
        </h1>

        {/* Filter Options */}
        <div className="flex justify-between mb-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Select Course</option>
            <option value="BTech 2021">BTech 2021</option>
            <option value="BTech 2022">BTech 2022</option>
            <option value="BTech 2023">BTech 2023</option>
            <option value="BTech 2024">BTech 2024</option>
            <option value="MTech 2023">MTech 2023</option>
            <option value="MTech 2024">MTech 2024</option>
            <option value="MBA 2023">MBA 2023</option>
            <option value="MBA 2024">MBA 2024</option>
            <option value="MSc 2023">MSc 2023</option>
            <option value="MSc 2024">MSc 2024</option>
            <option value="BSc BEd 2023">BSc BEd 2023</option>
            <option value="BSc BEd 2024">BSc BEd 2024</option>
            <option value="PhD 2021">PhD 2021</option>
            <option value="PhD 2022">PhD 2022</option>
            <option value="PhD 2023">PhD 2023</option>
            <option value="PhD 2024">PhD 2024</option>
            <option value="Faculty">Faculty</option>
            <option value="Others">Others</option>
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Select Item Category</option>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {paginatedItems.map((item) => (
            <div 
              key={item.$id} 
              onClick={() => handleClick(item.$id)} 
              className="bg-white cursor-pointer rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">Image Is Not Available or For Clue</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                    Found
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
                    <span className="font-bold mr-1">Found at:&nbsp;</span>
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    {new Date(item.$createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <span className="text-green-600 font-medium text-sm sm:text-base">
                    Found by: {item.name}
                  </span>
                  <button 
                    className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${item.phone}`;
                    }}
                  >
                    {item.phonePrivate?"Mob no private":item.phone}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-300 mt-8 text-lg">
            No items found
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 border border-green-500 rounded-lg p-2 bg-gray-800">
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1} 
            className={`px-4 py-2 bg-green-600 text-white rounded-lg transition-colors duration-200 
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'}`}
          >
            Previous
          </button>
          <span className="text-green-500 mx-4">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages} 
            className={`px-4 py-2 bg-green-600 text-white rounded-lg transition-colors duration-200 
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Found;
