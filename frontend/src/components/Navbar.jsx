import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex justify-between items-center rounded-none shadow-md">
      <Link to="/" className="flex items-center gap-3">
        <BookOpen className="text-blue-500 text-3xl" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          GVCC Portal
        </span>
      </Link>
      
      <div>
        {user ? (
          <div className="flex items-center gap-6">
            <span className="text-slate-300 hidden md:block">Welcome, {user.name}</span>
            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full hover:bg-red-500/30 transition"
            >
              <LogOut /> Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 hover:text-blue-400 transition">Login</Link>
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-blue-500/30">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
