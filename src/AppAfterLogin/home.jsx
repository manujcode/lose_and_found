import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Link } from 'react-router-dom';

const Home = ({page, setPage}) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    successRate: '0%'
  });

  useEffect(() => {
    const fetchStats = async () => {
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
        
        // Filter out disabled items
        const activeLostItems = lostResponse.documents.filter(item => !item.Disabled && item.isActive !== false);
        const activeFoundItems = foundResponse.documents.filter(item => !item.Disabled && item.isActive !== false);
        // console.log('1>',activeLostItems);
        // console.log('2>',activeFoundItems);
        const recoveredLostItems = lostResponse.documents.filter(item => item.Disabled === true).length;
        const claimedFoundItems = foundResponse.documents.filter(item => item.Disabled === true).length;
        const lostItems = activeLostItems.length;
        const foundItems = activeFoundItems.length;
        const totalItems = lostItems + foundItems+recoveredLostItems+claimedFoundItems;
        
        // Calculate claimed/recovered items (only count those that were active)
        const totalSuccessful = recoveredLostItems + claimedFoundItems;
        // console.log('recoveredLostItems>',recoveredLostItems);
        // console.log('claimedFoundItems>',claimedFoundItems);
        // Calculate success rate
        const successRate = totalItems > 0 ? Math.round((totalSuccessful / totalItems) * 100) + '%' : '0%';
        
        setStats({
          totalItems,
          lostItems,
          foundItems,
          successRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const MenuCard = ({ title, to, color, icon, backgroundImage }) => (
    <Link 
      to={to}
      className={`${color} w-full rounded-2xl shadow-2xl transform transition-all duration-300 
        hover:scale-105 hover:shadow-3xl cursor-pointer overflow-hidden group`}
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}

    >
      <div className="h-64 sm:h-80 w-full p-6 sm:p-8 flex flex-col justify-between  bg-white/10">
        <div className="text-white text-4xl  sm:text-6xl">{icon}</div>
        <div>
          <h3 className="text-2xl sm:text-4xl backdrop-blur inline-block font-bold text-black mb-2 group-hover:text-black/90">{title}</h3>
          <div className="w-12 sm:w-16 h-1 bg-white rounded-full transform origin-left group-hover:scale-x-150 transition-transform"></div>
        </div>
      </div>
    </Link>
  );

  const StatCard = ({ title, value, color,backgroundImage }) => (
    <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
      <h3 className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-1">{title}</h3>
      <p className={`${color} text-2xl sm:text-4xl font-bold`}>{value}</p>

    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            NITJ Lost & Found Portal
          </h1>
          <div className="w-20 sm:w-24 md:w-40 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          <MenuCard 
            title="Lost Items"
            to="/dashboard/lost"
            color="bg-gradient-to-br from-red-500 to-red-700"
            icon=""
            backgroundImage ="/woman-8473560_1280.webp"
          />
          <MenuCard 
            title="Found Items"
            to="/dashboard/found"
            color="bg-gradient-to-br from-green-500 to-green-700"
            icon=""
            backgroundImage = "/9886321.jpg"
          />
            <MenuCard 
              title="Report Lost"
              to="/dashboard/upload-lost"
              color="bg-gradient-to-br from-purple-500 to-purple-700"
              icon=""
              backgroundImage = "/image.png"
            />
          <MenuCard 
            title="Report Found"
            to="/dashboard/upload-found"
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            icon=""
            backgroundImage ="/investigation-report-1024x683.png"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <StatCard title="Total Items" value={stats.totalItems.toString()} color="text-blue-400" />
          <StatCard title="Lost Items" value={stats.lostItems.toString()} color="text-red-400" />
          <StatCard title="Found Items" value={stats.foundItems.toString()} color="text-green-400" />
          <StatCard title="Success Rate" value={stats.successRate} color="text-yellow-400" />
        </div>
      </div>
    </div>
  );
};

// Add these styles to your CSS
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }

  .shadow-3xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
`;

export default Home;

