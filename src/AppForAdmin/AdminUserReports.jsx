import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';

const AdminUserReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // For demo purposes, we're assuming a collection for reports exists
        // You may need to create this collection in your Appwrite database
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_REPORT_COLLECTION_ID || 'reports', // Fallback to 'reports' if not defined
          [Query.orderDesc('$createdAt')]
        );
        
        setReports(response.documents);
      } catch (error) {
        console.error('Error fetching reports:', error);
        // For demo purposes, set mock data if collection doesn't exist
        setReports(getMockReports());
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [updateSuccess]);

  // Mock reports for demo purposes
  const getMockReports = () => {
    return [
      {
        $id: '1',
        $createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reporter_name: 'John Doe',
        reporter_email: 'john@example.com',
        subject: 'False claim on my item',
        description: 'Someone claimed my laptop was theirs but provided incorrect details.',
        item_id: 'laptop123',
        item_type: 'lost',
        status: 'pending',
        admin_response: '',
      },
      {
        $id: '2',
        $createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        reporter_name: 'Jane Smith',
        reporter_email: 'jane@example.com',
        subject: 'Inappropriate image upload',
        description: 'Someone uploaded an inappropriate image for a lost wallet.',
        item_id: 'wallet456',
        item_type: 'found',
        status: 'resolved',
        admin_response: 'We have removed the inappropriate image and warned the user. Thank you for your report.',
      },
      {
        $id: '3',
        $createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reporter_name: 'Mike Johnson',
        reporter_email: 'mike@example.com',
        subject: 'System bug when submitting form',
        description: 'I encountered an error when trying to submit a new found item. The page refreshed and all my information was lost.',
        item_id: '',
        item_type: '',
        status: 'in-progress',
        admin_response: 'We are investigating this issue. Could you please provide more details about your browser and device?',
      },
    ];
  };

  const handleViewReport = (report) => {
    setCurrentReport(report);
    setResponseText(report.admin_response || '');
    setShowReportModal(true);
  };

  const handleUpdateReport = async (e) => {
    e.preventDefault();
    
    try {
      // In a real implementation, update the report in the database
      // For demo purposes, we'll just update the local state
      
      const updatedReport = {
        ...currentReport,
        admin_response: responseText,
        status: responseText ? 'resolved' : currentReport.status,
      };
      
      // If connected to a real database, uncomment this
      /*
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_REPORT_COLLECTION_ID,
        currentReport.$id,
        {
          admin_response: responseText,
          status: responseText ? 'resolved' : currentReport.status,
        }
      );
      */
      
      // For demo, update the state
      setReports(reports.map(r => r.$id === updatedReport.$id ? updatedReport : r));
      
      setShowReportModal(false);
      setCurrentReport(null);
      setResponseText('');
      setUpdateSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating report:', error);
      setUpdateError('Failed to update report. Please try again.');
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setUpdateError('');
      }, 3000);
    }
  };

  // Filter reports based on search term and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-300';
      case 'resolved':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">User Reports Management</h2>
        <p className="text-gray-400 mb-6">
          View and respond to user reports and feedback about the Lost & Found system.
        </p>
        
        {/* Success and Error messages */}
        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-800 rounded-md text-green-400">
            Report updated successfully!
          </div>
        )}
        {updateError && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400">
            {updateError}
          </div>
        )}
        
        {/* Search and Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 py-2 px-3 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        
        {/* Reports list */}
        {filteredReports.length === 0 ? (
          <div className="bg-gray-800/40 rounded-lg p-8 text-center text-gray-400">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No reports found matching your criteria.</p>
          </div>
        ) : (
          <div className="bg-gray-800/40 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Report
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredReports.map((report) => (
                    <tr key={report.$id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{report.subject}</div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">{report.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{report.reporter_name}</div>
                        <div className="text-xs text-gray-400">{report.reporter_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(report.$createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-purple-400 hover:text-purple-300 ml-3"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Report Details Modal */}
      {showReportModal && currentReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-white">
                Report Details
              </h2>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setCurrentReport(null);
                  setResponseText('');
                }}
                className="text-gray-500 hover:text-gray-400"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{currentReport.subject}</h3>
                  <p className="text-sm text-gray-400">
                    Reported by {currentReport.reporter_name} ({currentReport.reporter_email})
                  </p>
                </div>
                <span className={`px-2 py-1 h-fit inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(currentReport.status)}`}>
                  {currentReport.status.charAt(0).toUpperCase() + currentReport.status.slice(1)}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400 mb-1">Date Reported</div>
                <div className="text-sm text-white">{new Date(currentReport.$createdAt).toLocaleString()}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400 mb-1">Description</div>
                <div className="text-sm text-white bg-gray-700/50 p-3 rounded-md">{currentReport.description}</div>
              </div>
              
              {currentReport.item_id && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400 mb-1">Related Item</div>
                  <div className="text-sm text-white">
                    Type: {currentReport.item_type.charAt(0).toUpperCase() + currentReport.item_type.slice(1)} Item<br />
                    Item ID: {currentReport.item_id}
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleUpdateReport}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Admin Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Enter your response to this report..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setCurrentReport(null);
                    setResponseText('');
                  }}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
                >
                  Save Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserReports; 