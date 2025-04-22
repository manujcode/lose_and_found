import React, { useState, useEffect, useRef } from 'react'
import { logoutUser } from '../auth';
import { Navigate, useNavigate, Link } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';

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

// List of security guard emails who can access the security dashboard
const SECURITY_EMAILS = [
  'manujg.it.21@nitj.ac.in',
  'guard@nitj.ac.in',
  // Add security guard emails here
];

const Navbar = ({page,setPage,user,setUser}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);
    const isSecurityGuard = user && (SECURITY_EMAILS.includes(user.email) || user.email.includes('security') || user.email.includes('guard'));
   
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

    const handleLogout = async() => {
        try {
            await logoutUser();
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleAdminClick = () => {
        navigate('/admin');
    };

    const handleSecurityClick = () => {
        navigate('/security');
    };

    console.log(user,"nknknknk user")
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }; 

    const handleClick = () => {
        setPage(0); // Navigate to home page
    };

    const NavButton = ({ onClick, isActive, children }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold
                ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {children}
        </button>
    );

    return (
        user ? (
            <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 sticky top-0 z-50 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Title */}
                        <div 
                            onClick={handleClick} 
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
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <NavButton onClick={() => setPage(0)} isActive={page === 0}>
                                Home
                            </NavButton>
                            <NavButton onClick={() => setPage(2)} isActive={page === 2}>
                                Lost Items
                            </NavButton>
                            <NavButton onClick={() => setPage(1)} isActive={page === 1}>
                                Found Items
                            </NavButton>
                            <NavButton onClick={() => setPage(4)} isActive={page === 4}>
                                Report Lost
                            </NavButton>
                            <NavButton onClick={() => setPage(3)} isActive={page === 3}>
                                Report Found
                            </NavButton>
                            <Link
                                to="/my-uploads"
                                className="text-white hover:text-red-500 transition-colors duration-200"
                            >
                                My Dashboard
                            </Link>
                            
                            {isAdmin && (
                                <NavButton onClick={handleAdminClick} isActive={false}>
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Admin
                                    </span>
                                </NavButton>
                            )}

                            {isSecurityGuard && (
                                <NavButton onClick={handleSecurityClick} isActive={false}>
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Security
                                    </span>
                                </NavButton>
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
                                { text: 'Home', onClick: () => setPage(0), active: page === 0 },
                                { text: 'Lost Items', onClick: () => setPage(2), active: page === 2 },
                                { text: 'Found Items', onClick: () => setPage(1), active: page === 1 },
                                { text: 'Report Lost', onClick: () => setPage(4), active: page === 4 },
                                { text: 'Report Found', onClick: () => setPage(3), active: page === 3 },
                                { text: 'My Dashboard', onClick: () => setPage(5), active: page === 5 },
                                ...(isAdmin ? [{ text: 'Admin Dashboard', onClick: handleAdminClick, active: false }] : []),
                                ...(isSecurityGuard ? [{ text: 'Security Dashboard', onClick: handleSecurityClick, active: false }] : []),
                            ].map((item) => (
                                <button
                                    key={item.text}
                                    onClick={() => {
                                        item.onClick();
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                                        item.active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {item.text}
                                </button>
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
