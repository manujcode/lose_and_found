// src/auth.js
import { account, OAuthProvider } from './appwrite.js'

export const loginWithGoogle = async () => {
  try {
    await account.createOAuth2Session(OAuthProvider.Google,
         'https://nitj-lose-found.vercel.app',
         'https://nitj-lose-found.vercel.app/failed'
    )
  } catch (error) {
    console.error(error,"xxxxx")
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
