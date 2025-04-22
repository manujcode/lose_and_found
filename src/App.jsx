// src/App.js
import React, { useState } from 'react'
import Auth from './Auth.jsx'
import { Route, Routes } from 'react-router-dom'
import Success from './success.jsx'
import Failed from './failed.jsx'
import AdminRoute from './AppForAdmin/AdminRoute.jsx'
import MyUploads from './AppAfterLogin/MyUploads'
import lost from './AppAfterLogin/lost'
import found from './AppAfterLogin/found'
import Upload_lost from './AppAfterLogin/Upload_lost'
import AppForSecurityGuard from './AppAfterLogin/AppForSecurityGuard'
import SecurityGuardRoute from './AppAfterLogin/SecurityGuardRoute'

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
          <Route path="/lost" element={<lost user={user} />} />
          <Route path="/found" element={<found user={user} />} />
          <Route path="/my-uploads" element={<MyUploads user={user} />} />
          <Route path="/upload-lost" element={<Upload_lost user={user} />} />
          <Route path="/security" element={<SecurityGuardRoute user={user} setUser={setUser} />} />
        </Routes>
      </header>
    </div>
  )
}

export default App

