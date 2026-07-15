import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaPlay, FaBookmark, FaShieldAlt } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        Master Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Future</span>
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mb-12">
        The ultimate MERN stack Learning Portal with advanced video features, infinite bookmarks, and secure playback.
      </p>
      
      <div className="flex gap-4 mb-20">
        <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition shadow-lg shadow-blue-500/30 text-lg">
          Start Learning Now
        </Link>
        <Link to="/login" className="glass-panel hover:bg-white/10 px-8 py-4 rounded-full font-bold transition text-lg border border-white/20">
          Sign In
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="glass-panel p-8 text-left hover:-translate-y-2 transition duration-300">
          <FaPlay className="text-blue-400 text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">High-Quality Library</h3>
          <p className="text-slate-400">Access exclusive video courses on full-stack development, AWS, and modern architecture.</p>
        </div>
        <div className="glass-panel p-8 text-left hover:-translate-y-2 transition duration-300">
          <FaBookmark className="text-purple-400 text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Infinite Bookmarks</h3>
          <p className="text-slate-400">Never lose your place. Save specific timestamps with custom notes directly on any video.</p>
        </div>
        <div className="glass-panel p-8 text-left hover:-translate-y-2 transition duration-300">
          <FaShieldAlt className="text-emerald-400 text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Secure Playback</h3>
          <p className="text-slate-400">Advanced anti-screenshot protection algorithms ensure our proprietary content stays safe.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
