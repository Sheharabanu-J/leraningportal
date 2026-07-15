import React from 'react';
import { FaPlay, FaEdit, FaTrash } from 'react-icons/fa';

const BookmarkList = ({ bookmarks, onSeek, onDelete, onEdit }) => {
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (bookmarks.length === 0) {
    return <div className="text-gray-400 p-4 italic">No bookmarks yet.</div>;
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      {bookmarks.map((b) => (
        <div key={b._id} className="glass-card p-3 rounded-xl flex justify-between items-center group hover:border-primary-500/50 transition">
          <div className="flex flex-col cursor-pointer" onClick={() => onSeek(b.timestamp)}>
            <span className="font-medium text-white">{b.bookmarkName || 'Untitled Bookmark'}</span>
            <span className="text-sm text-primary-400">{formatTime(b.timestamp)}</span>
          </div>
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onSeek(b.timestamp)} className="text-primary-400 hover:text-primary-300">
              <FaPlay />
            </button>
            <button onClick={() => onEdit(b)} className="text-blue-400 hover:text-blue-300">
              <FaEdit />
            </button>
            <button onClick={() => onDelete(b._id)} className="text-red-400 hover:text-red-300">
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookmarkList;
