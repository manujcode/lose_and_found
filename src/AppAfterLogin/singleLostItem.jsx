import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import { ID } from 'appwrite'

const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
};


const SingleLostItem = ({user ,id,setSelectedItem}) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await databases.getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
          id
        );
        setItem(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);
   
  const handleback = ()=>{
    setSelectedItem(null);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Item not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => handleback()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            ← Back to List
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:flex-shrink-0 md:w-1/2 relative group">
              {item.imageUrl ? (
                <a 
                  href={item.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full w-full relative overflow-hidden"
                >
                  <img
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={item.imageUrl}
                    alt={item.title + ' image not available'}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">
                      Click to view full image
                    </span>
                  </div>
                </a>
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 md:h-full">
                  <span className="text-gray-500 text-center px-4">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-500 text-white shadow-lg">
                  Lost Item
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:w-1/2 bg-gradient-to-br from-white to-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Posted on {new Date(item.$createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start group">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-semibold text-gray-500">Color</dt>
                        <dd className="mt-1 text-gray-900">{item.color}</dd>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-semibold text-gray-500">Last Seen Location</dt>
                        <dd className="mt-1 text-gray-900">{item.location}</dd>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-semibold text-gray-500">Course</dt>
                        <dd className="mt-1 text-gray-900">{item.course || 'Not specified'}</dd>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-semibold text-gray-500">Tags</dt>
                        <dd className="mt-1 text-gray-900">{item.tags || 'Not specified'}</dd>
                      </div>
                    </div>
                  </dl>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Contact Information
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.email}</p>
                        </div>
                      </div>
                      {!item.phonePrivate && item.phone !== 1000000000 && (
                        <button 
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${item.phone}`;
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {item.phone}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {item.additionalDetails && (
                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Additional Details
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{item.additionalDetails}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleLostItem;
