const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  bookmarkName: {
    type: String,
  },
  timestamp: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
