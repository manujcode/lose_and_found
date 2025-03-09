// src/auth.js
import { account, OAuthProvider } from './appwrite.js'

const getRedirectUrl = (path = '') => {
  const baseUrl = import.meta.env.PROD 
    ? import.meta.env.VITE_APP_URL
    : 'http://localhost:5173';
  return `${baseUrl}${path}`;
};

export const loginWithGoogle = async () => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      getRedirectUrl('/success'),
      getRedirectUrl('/failed')
    );
  } catch (error) {
    console.error("OAuth error:", error);
    // You might want to handle the error more gracefully here
    throw error; // Re-throw to handle it in the component
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession('current')
  } catch (error) {
    console.error(error)
  }
}

export const getUser = async () => {
  try {
    return await account.get()
  } catch (error) {
    console.error(error)
  }
}

