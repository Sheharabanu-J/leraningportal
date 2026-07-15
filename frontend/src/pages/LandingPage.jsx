import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Welcome to <span className="gradient-text">GVCC Learning Portal</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          The most advanced platform for your educational journey. Experience seamless video learning with powerful tools.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            Get Started
          </Link>
          <Link to="/login" className="glass-card hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
            Login
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl"
      >
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-3 text-primary-400">Smart Bookmarks</h3>
          <p className="text-gray-400">Add precise timestamps to your videos and jump right back to important concepts instantly.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-3 text-secondary-400">Screenshot Protection</h3>
          <p className="text-gray-400">Advanced security measures to protect premium educational content from being copied.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-3 text-blue-400">Progress Tracking</h3>
          <p className="text-gray-400">Auto-save your playback position and continue exactly where you left off across all devices.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
