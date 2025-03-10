// src/auth.js
import { account, OAuthProvider } from './appwrite.js'

const getRedirectUrl = (path = '') => {
  // Get the current URL from the window object
  const currentUrl = window.location.origin;
  return `${currentUrl}${path}`;
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
    throw error;
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

