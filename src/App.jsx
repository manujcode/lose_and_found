// src/App.js
import React, { useState } from 'react'
import Auth from './Auth.jsx'
import { Route, Routes } from 'react-router-dom'
import Success from './success.jsx'
import Failed from './failed.jsx'
import AdminRoute from './AppForAdmin/AdminRoute.jsx'

const App = () => {
  const [user, setUser] = useState(null)
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/' element={<Auth user={user} setUser={setUser} />}  />
          <Route path='/success' element ={<Success user={user} setUser={setUser} />} />
          <Route path='/failed' element ={<Failed/>} />
          <Route path='/admin' element={<AdminRoute user={user} setUser={setUser} />} />
        </Routes>
      </header>
    </div>
  )
}

export default App

