import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppForSecurityGuard from './AppForSecurityGuard';
import { Client, Databases, Query } from 'appwrite';

// Remove the hardcoded email list as we'll check against the database
// const SECURITY_EMAILS = [
//   'security@nitj.ac.in',
//   'guard@nitj.ac.in',
//   'manujg.it.21@nitj.ac.in',
//   // Add security guard emails here
// ];

const SecurityGuardRoute = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [isSecurityGuard, setIsSecurityGuard] = useState(false);

  useEffect(() => {
    const checkSecurityGuard = async () => {
      if (!user || !user.email) {
        setIsSecurityGuard(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

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
        setLoading(false);
      }
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