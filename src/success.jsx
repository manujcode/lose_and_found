import React from 'react'
import MainPage from './AppAfterLogin/mainPage';

const Success = ({user ,setUser }) => {

  return (
    <div>
      <MainPage user ={user} setUser={setUser}></MainPage>

    </div>
  )
}

export default Success;

