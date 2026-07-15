import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { FaBookmark, FaTrash, FaPlay } from 'react-icons/fa';

const BookmarkPanel = ({ videoId, currentPlayedSeconds, onSeek }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkName, setBookmarkName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, [videoId]);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get(`/bookmarks/${videoId}`);
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/bookmarks', {
        videoId,
        bookmarkName: bookmarkName || 'Bookmark',
        timestamp: currentPlayedSeconds
      });
      setBookmarkName('');
      fetchBookmarks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      fetchBookmarks();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel flex flex-col h-full sticky top-24">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
          <FaBookmark className="text-purple-400" /> Bookmarks
        </h3>
        
        <form onSubmit={handleAddBookmark} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Note (optional)..."
            className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            value={bookmarkName}
            onChange={e => setBookmarkName(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm font-bold transition disabled:opacity-50"
          >
            Add @ {formatTime(currentPlayedSeconds)}
          </button>
        </form>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 hide-scrollbar">
        {bookmarks.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No bookmarks yet.</div>
        ) : (
          bookmarks.map(bm => (
            <div key={bm._id} className="bg-white/5 border border-white/10 p-3 rounded hover:bg-white/10 transition group flex justify-between items-start">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onSeek(bm.timestamp)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded font-mono">
                    {formatTime(bm.timestamp)}
                  </span>
                  <FaPlay className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-sm text-slate-200">{bm.bookmarkName}</p>
              </div>
              <button 
                onClick={() => handleDelete(bm._id)}
                className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookmarkPanel;
