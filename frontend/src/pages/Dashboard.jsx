import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaSearch, FaClock } from 'react-icons/fa';
import api from '../utils/axiosConfig';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [recent, setRecent] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, recentRes] = await Promise.all([
          api.get('/videos'),
          api.get('/progress/recent')
        ]);
        setVideos(videosRes.data);
        setRecent(recentRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['All', ...new Set(videos.map(v => v.category).filter(Boolean))];

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) && 
    (category === 'All' || v.category === category)
  );

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Discover</h1>
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search videos..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500 transition"
          />
        </div>
      </div>

      {recent.length > 0 && search === '' && category === 'All' && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FaClock className="text-primary-400" /> Recently Watched</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recent.map((item) => item.videoId && (
              <Link to={`/video/${item.videoId._id}`} key={item._id} className="min-w-[280px] glass-card rounded-xl overflow-hidden group">
                <div className="relative h-40">
                  <img src={item.videoId.thumbnail} alt={item.videoId.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <div className="bg-primary-600 rounded-full p-3"><FaPlay /></div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold truncate">{item.videoId.title}</h3>
                  {/* Progress bar could go here */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${category === cat ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'glass-card hover:bg-white/10 text-gray-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <div key={video._id} className="glass-card rounded-xl overflow-hidden group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold">{video.duration}</div>
              <Link to={`/video/${video._id}`} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <div className="bg-primary-600 rounded-full p-4"><FaPlay className="text-xl" /></div>
              </Link>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="text-xs text-primary-400 font-bold mb-1 uppercase">{video.category}</span>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{video.description}</p>
              <Link to={`/video/${video._id}`} className="w-full text-center py-2 rounded-lg border border-primary-500/50 text-primary-400 hover:bg-primary-500/10 transition font-medium">
                Watch Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {filteredVideos.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No videos found.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
