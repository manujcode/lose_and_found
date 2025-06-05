import React, { useState, useEffect, useRef } from 'react'
import { logoutUser } from '../auth';
import { Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { Client, Databases, Query } from 'appwrite';

// List of admin emails who can access the admin dashboard
// In a real application, this should come from a secure source like environment variables
// For demo purposes, add your own email here to test the admin functionality
const ADMIN_EMAILS = [
  'manujg.it.21@nitj.ac.in',
  'kumarmohit@nitj.ac.in',
  'namant.ec.22@nitj.ac.in'
  // Replace with your email to test
  // Add more admin emails as needed
];

const Navbar = ({user, setUser}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSecurityGuard, setIsSecurityGuard] = useState(false);
    const [securityCheckComplete, setSecurityCheckComplete] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);
   
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Add effect to check if the user is a security guard using the database
    useEffect(() => {
      const checkSecurityGuard = async () => {
        if (!user || !user.email) {
          setIsSecurityGuard(false);
          setSecurityCheckComplete(true);
          return;
        }

        try {
          // Initialize Appwrite client
          const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
          
          const databases = new Databases(client);
          const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
          const securityGuardsCollectionId = import.meta.env.VITE_APPWRITE_SECURITY_GUARDS_COLLECTION_ID;

          // Query the database to check if user's email is in the security_email field
          const response = await databases.listDocuments(
            databaseId,
            securityGuardsCollectionId,
            [
              Query.equal('security_email', user.email)
            ]
          );

          // If we found any documents, user is a security guard
          setIsSecurityGuard(response.documents.length > 0);
        } catch (error) {
          console.error('Error checking security guard status:', error);
          setIsSecurityGuard(false);
        } finally {
          setSecurityCheckComplete(true);
        }
      };

      checkSecurityGuard();
    }, [user]);

    const handleLogout = async() => {
        try {
            await logoutUser();
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }; 

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold
                ${location.pathname === to 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {children}
        </Link>
    );

    // If security check is not complete, we could show a loading indicator
    // But to avoid UI flicker, we'll just render normally without security button
    // until the check is complete

    return (
        user ? (
            <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 sticky top-0 z-50 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Title */}
                        <Link 
                            to="/dashboard"
                            className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                        >
                            <img 
                                src="/logo_250.png" 
                                alt="NITJ Logo" 
                                className="h-10 w-10 bg-white rounded-full p-1"
                            />
                            <div className="flex text-xl font-bold">
                                <span className="text-green-500">NITJ</span>
                                <span className="text-white mx-2">-</span>
                                <span className="text-green-500">Lost & Found</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <NavLink to="/dashboard">
                                Home
                            </NavLink>
                            <NavLink to="/dashboard/lost">
                                Lost Items
                            </NavLink>
                            <NavLink to="/dashboard/found">
                                Found Items
                            </NavLink>
                            <NavLink to="/dashboard/upload-lost">
                                Report Lost
                            </NavLink>
                            <NavLink to="/dashboard/upload-found">
                                Report Found
                            </NavLink>
                            <NavLink to="/dashboard/my-uploads">
                                My Dashboard
                            </NavLink>
                            
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-gray-300 hover:bg-gray-700/50 hover:text-white"
                                >
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Admin
                                    </span>
                                </Link>
                            )}

                            {securityCheckComplete && isSecurityGuard && (
                                <Link
                                    to="/security"
                                    className="px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-gray-300 hover:bg-gray-700/50 hover:text-white"
                                >
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Security
                                    </span>
                                </Link>
                            )}

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden lg:block">{user?.name?.split(' ')[0]}</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden bg-gray-700 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {[
                                { text: 'Home', to: '/dashboard', active: location.pathname === '/dashboard' },
                                { text: 'Lost Items', to: '/dashboard/lost', active: location.pathname === '/dashboard/lost' },
                                { text: 'Found Items', to: '/dashboard/found', active: location.pathname === '/dashboard/found' },
                                { text: 'Report Lost', to: '/dashboard/upload-lost', active: location.pathname === '/dashboard/upload-lost' },
                                { text: 'Report Found', to: '/dashboard/upload-found', active: location.pathname === '/dashboard/upload-found' },
                                { text: 'My Dashboard', to: '/dashboard/my-uploads', active: location.pathname === '/dashboard/my-uploads' },
                                ...(isAdmin ? [{ text: 'Admin Dashboard', to: '/admin', active: location.pathname === '/admin' }] : []),
                                ...(securityCheckComplete && isSecurityGuard ? [{ text: 'Security Dashboard', to: '/security', active: location.pathname === '/security' }] : []),
                            ].map((item) => (
                                <Link
                                    key={item.text}
                                    to={item.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                                        item.active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {item.text}
                                </Link>
                            ))}
                            <div className="border-t border-gray-700 pt-4 pb-3">
                                <div className="px-3">
                                    <p className="text-base font-medium text-white">{user?.name}</p>
                                    <p className="text-sm text-gray-400">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="mt-3 w-full px-3 py-2 text-base font-medium text-red-500 hover:bg-gray-700 rounded-md"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        ) : (
            <Navigate to="/" />
        )
    );
}

export default Navbar
