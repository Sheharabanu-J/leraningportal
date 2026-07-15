import React from 'react';
import { FaPlay, FaUndo } from 'react-icons/fa';

const ContinueWatchingPopup = ({ lastPosition, onResume, onStartOver }) => {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-panel p-8 max-w-sm w-full text-center shadow-2xl shadow-blue-500/20 transform animate-in fade-in zoom-in duration-300">
        <h3 className="text-2xl font-bold mb-2">Resume Playback</h3>
        <p className="text-slate-300 mb-8">
          You left off at <span className="text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">{formatTime(lastPosition)}</span>.<br/>
          Would you like to continue?
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onResume}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition shadow-lg shadow-blue-500/30"
          >
            <FaPlay /> Resume
          </button>
          <button 
            onClick={onStartOver}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-3 rounded transition border border-white/10"
          >
            <FaUndo /> Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingPopup;
