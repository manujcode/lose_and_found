// src/appwrite.js
import { Client, Account,Databases, OAuthProvider,Storage } from 'appwrite'

const client = new Client()
client
  .setEndpoint('https://cloud.appwrite.io/v1')// The Appwrite API endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)// Your Appwrite project ID
  export const account = new Account(client)
const databases = new Databases(client);
const storage = new Storage(client);

export { OAuthProvider,databases ,storage }


