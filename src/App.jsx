// src/App.js
import React, { useState } from 'react'
import Auth from './Auth.jsx'
import { Route, Routes } from 'react-router-dom'
import Failed from './failed.jsx'
import AdminRoute from './AppForAdmin/AdminRoute.jsx'
import SecurityGuardRoute from './AppAfterLogin/SecurityGuardRoute'
import ProtectedRoute from './ProtectedRoute.jsx'
import MainPage from './AppAfterLogin/mainPage'
import Home from './AppAfterLogin/home'
import Lost from './AppAfterLogin/lost'
import Found from './AppAfterLogin/found'
import Upload_find from './AppAfterLogin/Upload_find'
import Upload_lost from './AppAfterLogin/Upload_lost'
import AboutUs from './AppAfterLogin/AboutUs'
import MyUploads from './AppAfterLogin/MyUploads'
import AppForSecurityGuard from './AppAfterLogin/AppForSecurityGuard'

const App = () => {
  const [user, setUser] = useState(null)
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Auth user={user} setUser={setUser} />} />
        <Route path='/failed' element={<Failed />} />
        
        {/* Protected main layout with nested routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <MainPage user={user} setUser={setUser} />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="found" element={<Found user={user} />} />
          <Route path="lost" element={<Lost user={user} />} />
          <Route path="upload-found" element={<Upload_find user={user} />} />
          <Route path="upload-lost" element={<Upload_lost user={user} />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="my-uploads" element={<MyUploads user={user} />} />
        </Route>
        
        {/* Admin route */}
        <Route path='/admin' element={
          <AdminRoute user={user} setUser={setUser} />
        } />
        
        {/* Security guard route */}
        <Route path='/security' element={
          <SecurityGuardRoute user={user} setUser={setUser} />
        } />
      </Routes>
    </div>
  )
}

export default App

