import React, { useEffect, useState } from 'react'
import Navbar from './navbar';
import Footer from './footer';
import Home from './home';
import Lost from './lost';
import Found from './found';
import Upload_find from './Upload_find';
import Upload_lost from './Upload_lost';
import { getUser } from '../auth';
import { Navigate } from 'react-router-dom';

const MainPage = ({user,setUser}) => {
     
    const [page,setPage]=useState(0)
    
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
            <Navbar page={page} setPage={setPage} user={user} setUser={setUser}></Navbar>
            { page==0 && <Home page={page} setPage={setPage} ></Home>}
            { page==1 && <Found></Found>}
            { page==2 && <Lost></Lost>}
            { page==3 && <Upload_find user={user}></Upload_find>}
            { page==4 && <Upload_lost user={user}></Upload_lost>}
            <Footer></Footer> 
        </div>
    ) : 
    <Navigate to="/" />
       }
    </>

  )
}

export default MainPage;

