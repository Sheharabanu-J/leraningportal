import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';
import api from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const Comments = ({ videoId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/comments/video/${videoId}`);
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post('/comments', {
        videoId,
        userId: user._id,
        userName: user.name, // Save name directly for mock purposes
        comment: newComment
      });
      setComments([data, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">Discussion ({comments.length})</h3>
      
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
          <FaUserCircle className="text-2xl text-white" />
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a public comment..."
            className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-primary-500 transition pr-10"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="absolute right-0 top-0 text-primary-500 hover:text-primary-400 disabled:text-gray-600 transition"
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="animate-pulse flex gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
            <div className="h-4 bg-white/10 rounded w-full"></div>
          </div>
        </div>
      ) : comments.length > 0 ? (
        <div className="flex flex-col gap-6">
          {comments.map(c => (
            <div key={c._id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-gray-400">{c.userName?.charAt(0) || '?'}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-200">{c.userName || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">Be the first to comment!</p>
      )}
    </div>
  );
};

export default Comments;
