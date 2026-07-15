import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-card sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold gradient-text">GVCC Learning</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-primary-500 transition">Dashboard</Link>
            <Link to="/profile" className="flex items-center gap-2 hover:text-primary-500 transition">
              <FaUserCircle size={24} />
              <span>{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-500 transition ml-4">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-primary-500 transition">Login</Link>
            <Link to="/signup" className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-primary-500/30">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
