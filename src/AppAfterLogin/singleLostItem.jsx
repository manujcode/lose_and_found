import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { useParams } from 'react-router-dom';

const SingleLostItem = ({id,setSelectedItem}) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
//   const { id } = useParams();

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
        <button 
          onClick={() => handleback()}
          className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          ← Back to List
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                className="h-96 w-full object-cover md:h-full"
                src={item.imageUrl}
                alt={item.title}
              />
            </div>

            {/* Content Section */}
            <div className="p-8 md:w-1/2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Lost Item
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.$createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</h2>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-semibold text-gray-500">Color</dt>
                      <dd className="mt-1 text-gray-900">{item.color}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-500">Last Seen Location</dt>
                      <dd className="mt-1 text-gray-900">{item.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-500">Course</dt>
                      <dd className="mt-1 text-gray-900">{item.course || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-500">Tags</dt>
                      <dd className="mt-1 text-gray-900">{item.tags || 'Not specified'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Contact Information
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        {item.phone}
                      </button>
                    </div>
                  </div>
                </div>

                {item.additionalDetails && (
                  <div className="border-t border-gray-200 pt-4">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Additional Details
                    </h2>
                    <p className="mt-2 text-gray-600">{item.additionalDetails}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleLostItem;
