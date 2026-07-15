import React, { useState, useEffect } from 'react';

const BookmarkModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.bookmarkName || '');
    } else {
      setName('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 gradient-text">{initialData ? 'Edit Bookmark' : 'Add Bookmark'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Bookmark Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary-500 transition"
              placeholder="e.g., Introduction, Arrays"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition">
              Cancel
            </button>
            <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;
