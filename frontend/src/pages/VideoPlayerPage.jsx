import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CustomPlayer from '../components/VideoPlayer/CustomPlayer';
import ScreenshotProtection from '../components/VideoPlayer/ScreenshotProtection';
import BookmarkList from '../components/Bookmarks/BookmarkList';
import BookmarkModal from '../components/Bookmarks/BookmarkModal';
import ContinueWatchingPopup from '../components/VideoPlayer/ContinueWatchingPopup';
import Comments from '../components/VideoPlayer/Comments';
import api from '../utils/axiosConfig';

const VideoPlayerPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Player state
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  
  // Bookmark state
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  // Progress state
  const [progress, setProgress] = useState(null);
  const [showContinuePopup, setShowContinuePopup] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const lastSavedPositionRef = useRef(0);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const [videoRes, bookmarksRes, progressRes, relatedRes] = await Promise.all([
          api.get(`/videos/${id}`),
          api.get(`/bookmarks/video/${id}`),
          api.get(`/progress/${id}`),
          api.get(`/videos/youtube/related/${id}`).catch(() => ({ data: [] }))
        ]);
        
        setVideo(videoRes.data);
        setBookmarks(bookmarksRes.data);
        setProgress(progressRes.data);
        setRelatedVideos(relatedRes.data);

        // Check if there's a saved progress > 0
        if (progressRes.data && progressRes.data.lastPosition > 0 && !progressRes.data.completed) {
          setShowContinuePopup(true);
        } else {
          setPlaying(false); // Do not autoplay, let user click play to avoid browser block
        }
      } catch (err) {
        console.error('Error fetching video data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideoData();
    // Reset states on video change
    setShowContinuePopup(false);
    setPlaying(false);
  }, [id]);

  // Protection Logic
  useEffect(() => {
    const handleVisibilityChange = () => document.hidden ? setIsBlurred(true) : setIsBlurred(false);
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        setIsBlurred(true);
        setWarningMessage('Screenshot is not allowed.');
        setTimeout(() => { setIsBlurred(false); setWarningMessage(''); }, 3000);
      }
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85) || (e.ctrlKey && e.keyCode === 67)) {
        e.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  // Auto save progress every 5 seconds
  useEffect(() => {
    const saveProgress = async () => {
      if (playerRef.current && playing) {
        const currentPos = playerRef.current.getCurrentTime();
        // Only save if position changed significantly
        if (Math.abs(currentPos - lastSavedPositionRef.current) > 2) {
          try {
            await api.post('/progress', {
              videoId: id,
              lastPosition: currentPos,
              completed: false
            });
            lastSavedPositionRef.current = currentPos;
          } catch (err) {
            console.error('Failed to save progress');
          }
        }
      }
    };
    const interval = setInterval(saveProgress, 5000);
    return () => clearInterval(interval);
  }, [id, playing]);

  const handleResume = () => {
    setShowContinuePopup(false);
    if (playerRef.current) {
      playerRef.current.seekTo(progress.lastPosition);
      setPlaying(true);
    }
  };

  const handleRestart = () => {
    setShowContinuePopup(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      setPlaying(true);
    }
  };

  const handleAddBookmark = () => {
    if (playerRef.current) {
      setPlaying(false);
      setCurrentTimestamp(playerRef.current.getCurrentTime());
      setEditingBookmark(null);
      setIsBookmarkModalOpen(true);
    }
  };

  const handleSaveBookmark = async (name) => {
    try {
      if (editingBookmark) {
        const res = await api.put(`/bookmarks/${editingBookmark._id}`, { bookmarkName: name });
        setBookmarks(bookmarks.map(b => b._id === editingBookmark._id ? res.data : b));
      } else {
        const res = await api.post('/bookmarks', {
          videoId: id,
          bookmarkName: name,
          timestamp: currentTimestamp
        });
        setBookmarks([...bookmarks, res.data].sort((a, b) => a.timestamp - b.timestamp));
      }
      setIsBookmarkModalOpen(false);
      setPlaying(true);
    } catch (err) {
      console.error('Error saving bookmark', err);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      try {
        await api.delete(`/bookmarks/${bookmarkId}`);
        setBookmarks(bookmarks.filter(b => b._id !== bookmarkId));
      } catch (err) {
        console.error('Error deleting bookmark');
      }
    }
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsBookmarkModalOpen(true);
  };

  const handleSeek = (timestamp) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timestamp);
      setPlaying(true);
    }
  };

  const handleVideoEnd = async () => {
    try {
      await api.post('/progress', {
        videoId: id,
        lastPosition: playerRef.current.getCurrentTime(),
        completed: true
      });
    } catch (err) {
      console.error('Failed to mark complete');
    }
  };

  if (loading || !video) return <div className="flex justify-center items-center min-h-[calc(100vh-76px)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Massive Cinematic Video Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <div 
          className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 select-none"
          style={{ filter: isBlurred ? 'blur(20px)' : 'none', pointerEvents: isBlurred ? 'none' : 'auto' }}
        >
          {/* Warning Message */}
          {isBlurred && warningMessage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 text-white text-2xl font-bold">
              {warningMessage}
            </div>
          )}

          {/* Dynamic Watermark */}
          <div className="absolute top-4 right-4 text-right opacity-30 pointer-events-none z-40 text-xs text-white text-shadow">
            GVCC Learning<br/>{user?.email}<br/>{new Date().toLocaleTimeString()}
          </div>

          <div className="absolute inset-0">
            <CustomPlayer 
              url={video.videoUrl} 
              playerRef={playerRef} 
              playing={playing} 
              setPlaying={setPlaying}
            />
          </div>
        </div>

        {/* Content Below Video */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Info, Bookmarks, Comments */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <span className="text-sm text-primary-400 font-medium uppercase tracking-wider">{video.category}</span>
            </div>
            <button 
              onClick={handleAddBookmark}
              className="bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white border border-primary-500/30 px-4 py-2 rounded-lg transition shadow-lg flex items-center gap-2 font-medium"
            >
              + Add Bookmark
            </button>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">{video.description}</p>
          
          {/* Bookmarks Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">Bookmarks</h3>
            <BookmarkList 
              bookmarks={bookmarks} 
              onSeek={handleSeek} 
              onDelete={handleDeleteBookmark} 
              onEdit={handleEditBookmark}
            />
          </div>

              <Comments videoId={id} />
            </div>
          </div>

          {/* Right Column: Related Videos */}
          <div className="lg:w-[400px] flex flex-col gap-4">
            <div className="glass-card p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Related Videos</h3>
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {relatedVideos.length > 0 ? relatedVideos.map((rv, index) => (
              <Link to={`/video/${rv.id.videoId}`} key={index} className="flex gap-3 group bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
                <div className="w-36 h-24 rounded-lg overflow-hidden shrink-0 relative">
                  <img src={rv.snippet.thumbnails.medium.url} alt={rv.snippet.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                </div>
                <div className="flex flex-col flex-1 min-w-0 py-1">
                  <h4 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary-400 transition">{rv.snippet.title}</h4>
                  <span className="text-xs text-gray-400 mt-2 truncate">{rv.snippet.channelTitle}</span>
                </div>
              </Link>
            )) : (
              <p className="text-gray-400 text-sm italic text-center py-4">No related videos found (Requires API Key).</p>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>

      <BookmarkModal 
        isOpen={isBookmarkModalOpen} 
        onClose={() => {
          setIsBookmarkModalOpen(false);
          setPlaying(true);
        }} 
        onSave={handleSaveBookmark}
        initialData={editingBookmark}
      />

      {showContinuePopup && (
        <ContinueWatchingPopup 
          position={progress.lastPosition} 
          onResume={handleResume} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default VideoPlayerPage;
