const Video = require('../models/Video');
const axios = require('axios');

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching videos' });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    // If it's not a valid object id, it might be a youtube ID
    res.status(404).json({ message: 'Video not found' });
  }
};

exports.getRelatedYouTubeVideos = async (req, res) => {
  const { videoId } = req.params;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ message: 'YouTube API key not configured' });
  }
  
  try {
    // Note: We use search endpoint since relatedToVideoId requires a specific format and sometimes fails.
    // Or we can try the relatedToVideoId if it's a valid youtube ID.
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`;
    
    const response = await axios.get(url);
    res.json(response.data.items);
  } catch (error) {
    console.error('YouTube API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching related videos' });
  }
};
