// src/auth.js
import { account, OAuthProvider } from './appwrite.js'

const getRedirectUrl = (path = '') => {
  const baseUrl = import.meta.env.PROD 
    ? 'https://lose-and-found.vercel.app'
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
    console.error(error,"yuyuyu")
  }
}

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
