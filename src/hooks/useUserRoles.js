import { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';

export const useUserRoles = (user) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecurityGuard, setIsSecurityGuard] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin emails list - consider moving to environment variables
  const ADMIN_EMAILS = [
    'manujg.it.21@nitj.ac.in',
    'kumarmohit@nitj.ac.in',
    'namant.ec.22@nitj.ac.in'
  ];

  useEffect(() => {
    const checkRoles = async () => {
      setLoading(true);
      
      // Check admin status
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      // Check security guard status
      if (user && user.email) {
        try {
          // Initialize Appwrite client
          const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
          
          const databases = new Databases(client);
          const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
          const securityGuardsCollectionId = import.meta.env.VITE_APPWRITE_SECURITY_GUARDS_COLLECTION_ID;

          // Query the database
          const response = await databases.listDocuments(
            databaseId,
            securityGuardsCollectionId,
            [Query.equal('security_email', user.email)]
          );

          setIsSecurityGuard(response.documents.length > 0);
        } catch (error) {
          console.error('Error checking security guard status:', error);
          setIsSecurityGuard(false);
        }
      } else {
        setIsSecurityGuard(false);
      }

      setLoading(false);
    };

    checkRoles();
  }, [user]);

  return { isAdmin, isSecurityGuard, loading };
};