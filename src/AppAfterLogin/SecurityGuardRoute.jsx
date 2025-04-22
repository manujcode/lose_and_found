import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppForSecurityGuard from './AppForSecurityGuard';

// List of security guard emails who can access the security dashboard
// In a real application, this should come from a secure source like environment variables
const SECURITY_EMAILS = [
  'security@nitj.ac.in',
  'guard@nitj.ac.in',
  'manujg.it.21@nitj.ac.in',
  // Add security guard emails here
];

const SecurityGuardRoute = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [isSecurityGuard, setIsSecurityGuard] = useState(false);

  useEffect(() => {
    const checkSecurityGuard = async () => {
      setLoading(true);
      // Check if user exists and is a security guard
      // For demo, we're using a simple check against predefined emails
      // In a production app, you would check against user roles stored in the database
      if (user && (SECURITY_EMAILS.includes(user.email) || user.email.includes('security') || user.email.includes('guard'))) {
        setIsSecurityGuard(true);
      } else {
        setIsSecurityGuard(false);
      }
      setLoading(false);
    };

    checkSecurityGuard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-white mt-4">Verifying security access...</p>
        </div>
      </div>
    );
  }

  if (!isSecurityGuard) {
    return <Navigate to="/" replace />;
  }

  return <AppForSecurityGuard user={user} />;
};

export default SecurityGuardRoute; 