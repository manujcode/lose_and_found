import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';

const AdminAnalytics = ({ user }) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    recoveredItems: 0,
    successRate: '0%',
    disabledItems: 0,
    activeItems: 0,
  });
  
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch lost items
        const lostResponse = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LOST_COLLECTION_ID
        );
        
        // Fetch found items
        const foundResponse = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID
        );
        
        const lostItems = lostResponse.documents;
        const foundItems = foundResponse.documents;
        
        // Calculate overall stats
        const totalLost = lostItems.length;
        const totalFound = foundItems.length;
        const totalItems = totalLost + totalFound;
        
        // Calculate active vs disabled items
        const activeLostItems = lostItems.filter(item => !item.Disabled && item.isActive !== false);
        const activeFoundItems = foundItems.filter(item => !item.Disabled && item.isActive !== false);
        const disabledLostItems = lostItems.filter(item => item.Disabled === true || item.isActive === false);
        const disabledFoundItems = foundItems.filter(item => item.Disabled === true || item.isActive === false);
        
        const activeItems = activeLostItems.length + activeFoundItems.length;
        const disabledItems = disabledLostItems.length + disabledFoundItems.length;
        
        // Calculate recovered items
        const recoveredLostItems = lostItems.filter(item => item.Requested === true).length;
        const claimedFoundItems = foundItems.filter(item => item.owner_received === true).length;
        const recoveredItems = recoveredLostItems + claimedFoundItems;
        
        // Calculate success rate
        const successRate = totalItems > 0 ? Math.round((recoveredItems / totalItems) * 100) + '%' : '0%';
        
        // Set overall stats
        setStats({
          totalItems,
          lostItems: totalLost,
          foundItems: totalFound,
          recoveredItems,
          successRate,
          disabledItems,
          activeItems
        });
        
        // Calculate monthly stats (last 6 months)
        const months = [];
        const today = new Date();
        
        for (let i = 0; i < 6; i++) {
          const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthName = month.toLocaleString('default', { month: 'short' });
          const monthYear = `${monthName} ${month.getFullYear()}`;
          
          const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
          const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
          
          const lostInMonth = lostItems.filter(item => {
            const itemDate = new Date(item.$createdAt);
            return itemDate >= startDate && itemDate <= endDate;
          }).length;
          
          const foundInMonth = foundItems.filter(item => {
            const itemDate = new Date(item.$createdAt);
            return itemDate >= startDate && itemDate <= endDate;
          }).length;
          
          const recoveredInMonth = lostItems.filter(item => {
            if (!item.Requested) return false;
            const itemDate = new Date(item.$updatedAt);
            return itemDate >= startDate && itemDate <= endDate;
          }).length + foundItems.filter(item => {
            if (!item.owner_received) return false;
            const itemDate = new Date(item.$updatedAt);
            return itemDate >= startDate && itemDate <= endDate;
          }).length;
          
          months.push({
            month: monthYear,
            lost: lostInMonth,
            found: foundInMonth,
            recovered: recoveredInMonth,
            total: lostInMonth + foundInMonth
          });
        }
        
        setMonthlyStats(months.reverse());
        
        // Calculate category stats
        const categories = {};
        
        // Process lost items categories
        lostItems.forEach(item => {
          const category = item.tags || 'Uncategorized';
          if (!categories[category]) {
            categories[category] = { lost: 0, found: 0, total: 0 };
          }
          categories[category].lost += 1;
          categories[category].total += 1;
        });
        
        // Process found items categories
        foundItems.forEach(item => {
          const category = item.tags || 'Uncategorized';
          if (!categories[category]) {
            categories[category] = { lost: 0, found: 0, total: 0 };
          }
          categories[category].found += 1;
          categories[category].total += 1;
        });
        
        // Convert categories object to array and sort by total
        const categoryArray = Object.keys(categories).map(key => ({
          name: key,
          lost: categories[key].lost,
          found: categories[key].found,
          total: categories[key].total
        })).sort((a, b) => b.total - a.total);
        
        setCategoryStats(categoryArray);
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Stat card component
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-gray-800/60 rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-gray-700/50">
          {icon}
        </div>
      </div>
    </div>
  );

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
        <h2 className="text-xl font-bold text-white mb-4">Analytics Dashboard</h2>
        <p className="text-gray-400 mb-6">
          Comprehensive statistics and insights for the Lost & Found system.
        </p>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Items" 
            value={stats.totalItems}
            color="border-blue-500"
            icon={
              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard 
            title="Lost Items" 
            value={stats.lostItems}
            color="border-red-500"
            icon={
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <StatCard 
            title="Found Items" 
            value={stats.foundItems}
            color="border-green-500" 
            icon={
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatCard 
            title="Success Rate" 
            value={stats.successRate}
            color="border-yellow-500"
            icon={
              <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
          />
        </div>
        
        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/60 rounded-lg p-4 shadow-lg">
            <h3 className="text-purple-400 font-medium mb-3">Item Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">Active</span>
                  <span className="text-green-400 text-sm">{stats.activeItems}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalItems ? (stats.activeItems / stats.totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">Disabled</span>
                  <span className="text-red-400 text-sm">{stats.disabledItems}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalItems ? (stats.disabledItems / stats.totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">Recovered</span>
                  <span className="text-purple-400 text-sm">{stats.recoveredItems}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalItems ? (stats.recoveredItems / stats.totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/60 rounded-lg p-4 shadow-lg md:col-span-2">
            <h3 className="text-purple-400 font-medium mb-3">Monthly Activity</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-gray-400 py-2">Month</th>
                    <th className="text-center text-xs text-gray-400 py-2">Lost</th>
                    <th className="text-center text-xs text-gray-400 py-2">Found</th>
                    <th className="text-center text-xs text-gray-400 py-2">Recovered</th>
                    <th className="text-center text-xs text-gray-400 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((month, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-2 text-sm text-white">{month.month}</td>
                      <td className="py-2 text-sm text-center text-red-400">{month.lost}</td>
                      <td className="py-2 text-sm text-center text-green-400">{month.found}</td>
                      <td className="py-2 text-sm text-center text-purple-400">{month.recovered}</td>
                      <td className="py-2 text-sm text-center text-blue-400">{month.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Category breakdown */}
        <div className="bg-gray-800/60 rounded-lg p-4 shadow-lg mb-8">
          <h3 className="text-purple-400 font-medium mb-3">Item Categories</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs text-gray-400 py-2">Category</th>
                  <th className="text-center text-xs text-gray-400 py-2">Lost</th>
                  <th className="text-center text-xs text-gray-400 py-2">Found</th>
                  <th className="text-center text-xs text-gray-400 py-2">Total</th>
                  <th className="text-left text-xs text-gray-400 py-2">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((category, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="py-2 text-sm text-white">{category.name}</td>
                    <td className="py-2 text-sm text-center text-red-400">{category.lost}</td>
                    <td className="py-2 text-sm text-center text-green-400">{category.found}</td>
                    <td className="py-2 text-sm text-center text-blue-400">{category.total}</td>
                    <td className="py-2 pr-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${stats.totalItems ? (category.total / stats.totalItems) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 