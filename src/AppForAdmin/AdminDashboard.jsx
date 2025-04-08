import React, { useState } from 'react';
import AdminItemManager from './AdminItemManager';
import AdminDeliveredItems from './AdminDeliveredItems';
import { logoutUser } from '../auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ user, setUser }) => {
  const [currentView, setCurrentView] = useState('items');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Admin Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0">
              <h1 className="text-xl sm:text-2xl font-bold text-purple-500">
                Lost & Found Admin
              </h1>
              <div className="hidden sm:block h-6 w-px bg-gray-600 mx-4"></div>
              <div className="text-gray-300 text-xs sm:text-sm">
                Logged in as <span className="text-purple-400 font-medium">{user?.name}</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-6">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8 border-b border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setCurrentView('items')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                currentView === 'items'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
            >
              Manage Items
            </button>
            <button
              onClick={() => setCurrentView('delivered')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                currentView === 'delivered'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
            >
              Delivered Items
            </button>
            <button
              onClick={() => setCurrentView('reports')}
              className="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
            >
              User Reports
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content based on current view */}
        {currentView === 'items' && <AdminItemManager user={user} />}
        {currentView === 'delivered' && <AdminDeliveredItems user={user} />}
      </main>
    </div>
  );
};

export default AdminDashboard; 