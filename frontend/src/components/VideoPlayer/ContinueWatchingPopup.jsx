import React from 'react';

const ContinueWatchingPopup = ({ position, onResume, onRestart }) => {
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl text-center">
        <h2 className="text-xl font-bold mb-4 text-white">Continue Watching?</h2>
        <p className="text-gray-300 mb-6">
          You left off at <span className="font-bold text-primary-400">{formatTime(position)}</span>. Would you like to resume?
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onRestart} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition border border-white/20">
            Start Over
          </button>
          <button onClick={onResume} className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg transition">
            Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingPopup;
