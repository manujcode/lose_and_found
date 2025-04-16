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
  const [comments, setComments] = useState([]);
  const [comment,setComment] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestInfo, setRequestInfo] = useState('');

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
  const [ state,setState] = useState(1);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID,
          [Query.equal('productId', id)]
        );
        // sort acc to date and time
        const sortedComments = response.documents.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
        setComments(sortedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [id,state]);
   
    const handleCommentChange = (e) => {
      setComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (!comment) return;

      try {
        const newComment = {
          userName: user.name,
          commentVal: comment,
          eamil:user.email,
          productId:id,
          // createdAt: new Date().toISOString(),
        };

        await databases.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID,
          ID.unique(),
          newComment
        );
        setState(prev=>prev+1)
        setComment('');
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    };
   
  const handleback = ()=>{
    setSelectedItem(null);
  }

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the item status to delivered
     await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID,
        id,
        {
          Requested: true,
          Requested_reason: requestInfo
        }
      );
      //  console.log(req)
      setShowRequestModal(false);
      setRequestInfo('');
      alert('Item marked as delivered successfully!');
      setSelectedItem(null); // Go back to the list after successful delivery
    } catch (error) {
      console.error('Error marking item as delivered:', error);
      alert('Failed to mark item as delivered. Please try again.');
    }
  };

  const handleRequestChange = (e) => {
    const value = e.target.value;
    setRequestInfo(value);
  };

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
          <button
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Confirm Delivery
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:flex-shrink-0 md:w-1/2">
            {item.imageUrl ? (
                <img
                  className="h-96 w-full object-cover md:h-full"
                  src={item.imageUrl}
                  alt={item.title + ' image not available'}
                />
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-gray-200 md:h-full">
                  <span className="text-gray-500">Image Is Not Available or For Clue</span>
                </div>
              )}
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
                      {item.phonePrivate?"Mob no private":item.phone}
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
      <div className="max-w-4xl mx-auto mt-8">
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Comments
          </h2>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            rows="4"
            placeholder="Leave a comment..."
            onChange={(e)=>{handleCommentChange(e)}}
          ></textarea>
          <button
          onClick={(e)=>{handleCommentSubmit(e)}}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Submit Comment
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            User Comments
          </h2>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {comment.avatarUrl ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={comment.avatarUrl}
                      alt="User Avatar"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{getInitials(comment.userName)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-gray-900">{comment.userName}</div>
                    <div className="text-xs text-gray-500">{new Date(comment.$createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</div>
                  </div>
                  <p className="mt-1 text-sm text-gray-800">{comment.commentVal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Item Recovered Confirmation</h2>
            <form onSubmit={handleRequestSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recovery Details
                </label>
                <textarea
                  name="reason"
                  value={requestInfo}
                  onChange={handleRequestChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  required
                  placeholder="Please provide details about how the item was recovered and returned to the owner..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Recovery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleLostItem;
