import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlayCircle, FaCheckCircle } from 'react-icons/fa';

const VideoCard = ({ video, progress }) => {
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = progress && video.duration 
    ? Math.min(100, Math.round((progress.lastPosition / video.duration) * 100))
    : 0;

  return (
    <div className="glass-panel overflow-hidden group flex flex-col h-full hover:border-blue-500/50 transition duration-300">
      <div className="relative aspect-video bg-black overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-semibold">
          {formatDuration(video.duration)}
        </div>
        
        {progress && (
          <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
            <div 
              className={`h-full ${progress.completed ? 'bg-emerald-500' : 'bg-blue-500'}`} 
              style={{ width: `${progress.completed ? 100 : progressPercentage}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            {video.category}
          </span>
          {progress?.completed && <FaCheckCircle className="text-emerald-500" title="Completed" />}
        </div>
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{video.description}</p>
        
        <Link 
          to={`/video/${video._id}`}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-blue-600 border border-white/10 py-2 rounded font-medium transition"
        >
          <FaPlayCircle /> {progress && progress.lastPosition > 0 && !progress.completed ? 'Continue Watching' : 'Watch Now'}
        </Link>
      </div>
    </div>
  );
};

export default VideoCard;
