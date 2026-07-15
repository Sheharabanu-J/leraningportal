const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  category: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
