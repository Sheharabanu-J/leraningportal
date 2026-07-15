import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaHistory } from 'react-icons/fa';
import api from '../utils/axiosConfig';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/progress/recent');
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="p-6 h-[calc(100vh-76px)] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaHistory className="text-primary-500" /> Watch History
      </h1>

      {history.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl mb-4">You haven't watched any videos yet.</p>
          <Link to="/dashboard" className="text-primary-500 hover:underline">Explore Videos</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-4xl">
          {history.map((item) => {
            const video = item.videoId;
            if (!video) return null;
            return (
              <Link to={`/video/${video._id}`} key={item._id} className="glass-card p-4 rounded-xl flex gap-6 hover:border-primary-500/50 transition group">
                <div className="w-48 h-28 rounded-lg overflow-hidden relative shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <FaPlay className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition">{video.title}</h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{video.description}</p>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-primary-500 uppercase">{video.category}</span>
                    <span className={item.completed ? "text-green-500" : "text-yellow-500"}>
                      {item.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default History;
