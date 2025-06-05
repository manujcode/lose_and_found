import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { ID } from 'appwrite'
import { Query } from 'appwrite';

const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
};

// Define animation keyframes in the component
const pulseAnimation = `
@keyframes pulse-glow {
  0% {
    opacity: 0.6;
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
  }
  100% {
    opacity: 0.6;
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
}

@keyframes path-pulse {
  0% {
    box-shadow: 0 0 2px #3b82f6;
    opacity: 0.8;
  }
  50% {
    box-shadow: 0 0 10px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.4);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 2px #3b82f6;
    opacity: 0.8;
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
`;

// Horizontal timeline tracking component
const ItemStatusTimeline = ({ item }) => {
  // Determine which steps have been completed
  const guardReceived = item.guard_received === true;
  const ownerReceived = item.owner_received === true;
  const hasRemarks = item.guard_remarks && item.guard_remarks.trim() !== '';
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg mb-8 border border-gray-100">
      {/* Add animation keyframes */}
      <style>{pulseAnimation}</style>
      
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Item Tracking Status
      </h2>
      
      <div className="relative">
        {/* Progress Bar with Blinking Effect */}
        <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-in-out"
            style={{ 
              width: ownerReceived ? '100%' : guardReceived ? '50%' : '25%',
              animation: 'path-pulse 2s infinite',
            }}
          ></div>
          
          {/* Active tracking dot */}
          <div 
            className="absolute h-3 w-3 rounded-full bg-white border-2 border-blue-500"
            style={{
              top: '-1px',
              left: `${ownerReceived ? '100%' : guardReceived ? '50%' : '25%'}`,
              transform: 'translateX(-50%)',
              animation: 'bounce-subtle 2s infinite',
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)'
            }}
          ></div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Item Created */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 w-full md:w-1/3 relative">
            <div className={`flex-shrink-0 h-14 w-14 rounded-full bg-green-500 flex items-center justify-center z-10 mx-auto mb-3 shadow-md transform transition-transform hover:scale-110 duration-300`}>
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="px-4">
              <div className="font-semibold text-lg text-green-800">Item Reported</div>
              <div className="text-sm text-gray-500 mt-1">{new Date(item.$createdAt).toLocaleDateString()}</div>
              <div className="text-sm mt-1 bg-green-50 px-2 py-1 rounded-full inline-block">By  Founder </div>
            </div>
          </div>
          
          {/* Guard Received */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 w-full md:w-1/3 relative">
            <div className={`flex-shrink-0 h-14 w-14 rounded-full ${guardReceived ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center z-10 mx-auto mb-3 ${guardReceived ? 'shadow-lg' : ''}`}
                 style={{
                   animation: guardReceived && !ownerReceived ? 'pulse-glow 2s infinite' : 'none',
                   transition: 'all 0.3s ease'
                 }}>
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              
              {/* Ripple effect for active step */}
              {guardReceived && !ownerReceived && (
                <span className="absolute inset-0 rounded-full border-4 border-blue-300 opacity-75" 
                      style={{animation: 'ripple 1.5s infinite ease-out'}}></span>
              )}
            </div>
            <div className="px-4">
              <div className={`font-semibold text-lg ${guardReceived ? 'text-blue-800' : 'text-gray-500'}`}>
                {guardReceived ? 'Item Stored' : 'Awaiting Storage'}
              </div>
              {guardReceived ? (
                <div className="text-sm bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                  Security has item
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-1">Pending</div>
              )}
            </div>
          </div>
          
          {/* Owner Received */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3">
            <div className={`flex-shrink-0 h-14 w-14 rounded-full ${ownerReceived ? 'bg-purple-500' : 'bg-gray-300'} flex items-center justify-center z-10 mx-auto mb-3 ${ownerReceived ? 'shadow-lg' : ''}`}
                 style={{
                   animation: ownerReceived ? 'pulse-glow 2s infinite' : 'none',
                   transition: 'all 0.3s ease'
                 }}>
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              
              {/* Ripple effect for active step */}
              {ownerReceived && (
                <span className="absolute inset-0 rounded-full border-4 border-purple-300 opacity-75" 
                      style={{animation: 'ripple 1.5s infinite ease-out'}}></span>
              )}
            </div>
            <div className="px-4">
              <div className={`font-semibold text-lg ${ownerReceived ? 'text-purple-800' : 'text-gray-500'}`}>
                {ownerReceived ? 'Owner Claimed' : 'Awaiting Claim'}
              </div>
              {ownerReceived ? (
                <div className="text-sm bg-purple-50 px-2 py-1 rounded-full inline-block mt-1">
                  Item returned
                </div>
              ) : guardReceived ? (
                <div className="text-sm text-blue-500 mt-1">Ready for pickup go to main gate and claim</div>
              ) : (
                <div className="text-sm text-gray-500 mt-1">Not ready</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Notes (if any) - displayed below the timeline */}
      {hasRemarks && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center transform transition-transform hover:scale-110 duration-300">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="ml-4 flex-grow">
              <div className="font-semibold text-gray-900 text-lg">Security Notes</div>
              <div className="text-sm bg-gray-50 p-4 rounded-lg mt-2 border border-gray-100 shadow-inner">
                {item.guard_remarks}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SingleFoundItem = ({user,id, setSelectedItem}) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
          [Query.equal("$id", id),
          Query.select(['$id', "title",
              "description",
              "location",
              "color",
              "imageUrl",
              "tags",
              "course",
              "phonePrivate",
              "Requested",
              "Disabled_reason",
              "Disabled",
              "guard_received",
              "owner_received",
              "guard_remarks",
              "lastupdatebyemail",
              "lastupdatebyname",
              "$createdAt",
              "$updatedAt"

          ])]
        
        );
        setItem(response.documents[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleback = () => {
    setSelectedItem(null);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
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
            onClick={handleback}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
          >
            ← Back to List
          </button>
        </div>

        {/* Status Timeline - now displayed above the card */}
        <ItemStatusTimeline item={item} />

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:flex-shrink-0 md:w-1/2 relative">
              {item.imageUrl ? (
                <a 
                  href={item.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full w-full transition-transform duration-300 hover:scale-105"
                >
                  <img
                    className="h-96 w-full object-cover md:h-full"
                    src={item.imageUrl}
                    alt={item.title + ' image not available'}
                  />
                </a>
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 md:h-full">
                  <span className="text-gray-500 text-center px-4">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white shadow-lg">
                  Found Item
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
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-semibold text-gray-500">Color</dt>
                        <dd className="mt-1 text-gray-900">{item.color}</dd>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-semibold text-gray-500">Found Location</dt>
                        <dd className="mt-1 text-gray-900">{item.location}</dd>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-semibold text-gray-500">Course</dt>
                        <dd className="mt-1 text-gray-900">{item.course || 'Not specified'}</dd>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="bg-green-50 border border-green-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-green-800">Item Collection Information</h3>
                      <p className="mt-1 text-green-700">This item is collected by security guard at main gate NIT Jalandhar</p>
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
    </div>
  );
};

export default SingleFoundItem;
