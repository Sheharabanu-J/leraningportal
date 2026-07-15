import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaPlay, FaTrash } from 'react-icons/fa';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const BookmarksHub = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookmarksRes, videosRes] = await Promise.all([
          api.get('/bookmarks/all'),
          api.get('/videos')
        ]);
        setBookmarks(bookmarksRes.data);
        setVideos(videosRes.data);
      } catch (err) {
        toast.error('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      setBookmarks(bookmarks.filter(b => b._id !== id));
      toast.success('Bookmark removed');
    } catch (err) {
      toast.error('Failed to delete bookmark');
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="p-6 h-[calc(100vh-76px)] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaBookmark className="text-secondary-500" /> Bookmarks Hub
      </h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl mb-4">You have no bookmarks saved.</p>
          <Link to="/dashboard" className="text-secondary-500 hover:underline">Start watching and add some!</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => {
            const video = videos.find(v => v._id === b.videoId);
            if (!video) return null;
            return (
              <div key={b._id} className="glass-card rounded-xl overflow-hidden flex flex-col group relative">
                <div className="relative h-40">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="font-bold text-lg text-white drop-shadow-md line-clamp-1">{video.title}</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-secondary-400">{b.bookmarkName || 'Untitled Bookmark'}</h4>
                      <p className="text-sm text-gray-400 mt-1">Saved at {new Date(b.timestamp * 1000).toISOString().substr(11, 8)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-3 border-t border-white/10">
                    <Link to={`/video/${video._id}`} className="flex-1 bg-secondary-600/20 text-secondary-400 hover:bg-secondary-600 hover:text-white border border-secondary-500/30 py-2 rounded-lg transition text-center flex justify-center items-center gap-2 font-medium">
                      <FaPlay size={12} /> Play
                    </Link>
                    <button onClick={() => handleDelete(b._id)} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition border border-red-500/30">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default BookmarksHub;
