import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaHistory, FaBookmark, FaCompass } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Discover', path: '/discover', icon: <FaCompass /> },
    { name: 'History', path: '/history', icon: <FaHistory /> },
    { name: 'Bookmarks', path: '/bookmarks', icon: <FaBookmark /> },
  ];

  return (
    <div className="w-64 hidden md:flex flex-col glass-card h-[calc(100vh-76px)] sticky top-[76px] p-4">
      <div className="flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
