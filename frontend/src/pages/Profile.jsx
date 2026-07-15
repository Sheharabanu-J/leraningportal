import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="glass-card p-8 rounded-2xl flex flex-col items-center md:flex-row md:items-start gap-8">
        <div className="w-32 h-32 bg-primary-600/20 text-primary-400 rounded-full flex items-center justify-center border-4 border-primary-500/30">
          <FaUserCircle className="w-24 h-24" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2 gradient-text">{user.name}</h1>
          <p className="text-gray-400 mb-6">{user.email}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-white mb-1">12</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Videos Watched</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-white mb-1">45</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Bookmarks</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-white mb-1">3</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Certificates</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-white mb-1">24h</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Watch Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
