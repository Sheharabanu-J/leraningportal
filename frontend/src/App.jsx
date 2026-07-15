import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import VideoPlayerPage from './pages/VideoPlayerPage';
import Profile from './pages/Profile';
import History from './pages/History';
import BookmarksHub from './pages/BookmarksHub';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = ['/', '/login', '/signup'].includes(location.pathname);
  const hideNavbar = false;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {!hideNavbar && <Navbar />}
      <div className="flex h-full">
        {!hideSidebar && <Sidebar />}
        <div className={`flex-1 ${hideSidebar ? 'w-full' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/video/:id" 
              element={
                <ProtectedRoute>
                  <VideoPlayerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            {/* Fallback for other sidebar links */}
            <Route 
              path="/discover" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookmarks" 
              element={
                <ProtectedRoute>
                  <BookmarksHub />
                </ProtectedRoute>
              } 
            />
            {/* 404 Route */}
            <Route path="*" element={<div className="flex justify-center items-center h-full text-4xl">404 - Page Not Found</div>} />
          </Routes>
        </AppLayout>
        <ToastContainer theme="dark" position="bottom-right" />
      </Router>
    </AuthProvider>
  );
};

export default App;
