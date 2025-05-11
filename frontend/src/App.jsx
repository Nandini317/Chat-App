import { useState } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx' ; 
import SignUpPage from './pages/SignUpPage.jsx' ; 
import LoginPage from './pages/LoginPage.jsx' ; 
import SettingsPage from './pages/SettingsPage.jsx' ; 
import ProfilePage from './pages/ProfilePage.jsx' ; 
import { axiosInstance } from './lib/axios.js';
import { useAuthStore } from './store/useAuthStore.js';

function App() {
  const {authUser} = useAuthStore()
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<HomePage />} />
        <Route path = "/signup" element = {<SignUpPage />} />
        <Route path = "/login" element = {<LoginPage />} />
        <Route path = "/settings" element = {<SettingsPage />} />
        <Route path = "/profile" element = {<ProfilePage />} /> 
      </Routes>
    </>
  )
}

export default App
