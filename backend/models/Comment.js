const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video', // Note: For YouTube videos, we might save string ID, but for our DB it's ObjectId. We'll use String for flexibility with YT.
    required: true,
  },
  comment: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// Change videoId to String to support YouTube IDs as well.
commentSchema.path('videoId', String);

module.exports = mongoose.model('Comment', commentSchema);
