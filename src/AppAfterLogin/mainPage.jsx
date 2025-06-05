import React, { useEffect } from 'react'
import Navbar from './navbar';
import Footer from './footer';
import { Outlet, Navigate } from 'react-router-dom';
import { getUser } from '../auth';

const MainPage = ({user, setUser}) => {
    useEffect(() => {
      const checkUser = async () => {
        try {
          const userData = await getUser()
          setUser(userData)
        } catch (error) {
          setUser(null)
        }
      }
      checkUser()
    }, [])

  return (
    <>
    { user ? (
        <div>
            <Navbar user={user} setUser={setUser} />
            <main className="min-h-screen">
              <Outlet /> {/* This will render the child routes */}
            </main>
            <Footer />
        </div>
    ) : 
    <Navigate to="/" />
    }
    </>
  )
}

export default MainPage;

