import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

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

const AdminRoute = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      // Check if user exists and is an admin
      // For demo, we're using a simple check against predefined emails
      // In a production app, you would check against user roles stored in the database
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-white mt-4">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard user={user} setUser={setUser} />;
};

export default AdminRoute; 