import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import SingleLostItem from './singleLostItem';

const Lost = ({user}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const test1 = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
          [
            Query.equal("phonePrivate", false),
            Query.select(['$id', "email",
              "name",
              "phone",
              "description",
              "title",
              "location",
              "color",
              "tags",
              "imageUrl",
              "course",
              "phonePrivate",
              "Disabled",
              "Disabled_reason",
              "$createdAt",
              "$updatedAt",
              
          ])]
        );

        const test2 = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
          [Query.equal("phonePrivate", true),
            Query.select(['$id', "email",
              "name",
              "description",
              "title",
              "location",
              "color",
              "tags",
              "imageUrl",
              "course",
              "phonePrivate",
              "Disabled",
              "Disabled_reason",
              "$createdAt",
              "$updatedAt",
              
          ])]
        );

        const response = [...test1.documents, ...test2.documents];
        console.log(response);


        // Filter out disabled items
        const activeItems = response.filter(item => !item.Disabled);
        setItems(activeItems);
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
    return <SingleLostItem user ={user} id={selectedItem} setSelectedItem={setSelectedItem} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl underline font-bold text-center mb-6 sm:mb-8 text-red-500">
          Lost Items
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
            <option value="PhD 2021">PhD 2018</option>
            <option value="PhD 2022">PhD 2019</option>
            <option value="PhD 2023">PhD 2020</option>
            <option value="PhD 2021">PhD 2021</option>
            <option value="PhD 2022">PhD 2022</option>
            <option value="PhD 2023">PhD 2023</option>
            <option value="PhD 2024">PhD 2024</option>
            <option value="Faculty">Faculty</option>
            <option value="Staff">Staff</option>
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
              className="bg-white cursor-pointer rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 group">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-500 text-center px-4">No Image Available</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    Lost
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">
                  {item.title}
                </h2>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="text-sm">{item.color}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm truncate">{item.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">{new Date(item.$createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    {!item.phonePrivate && item.phone !== 1000000000 && (
                      <button 
                        className="flex items-center bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${item.phone}`;
                        }}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {item.phone}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-300 mt-8 text-lg">
            No lost items reported
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 border border-red-500 rounded-lg p-2 bg-gray-800">
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1} 
            className={`px-4 py-2 bg-red-600 text-white rounded-lg transition-colors duration-200 
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'}`}
          >
            Previous
          </button>
          <span className="text-red-500 mx-4">
            Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages || totalPages === 0} 
            className={`px-4 py-2 bg-red-600 text-white rounded-lg transition-colors duration-200 
              ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lost;
