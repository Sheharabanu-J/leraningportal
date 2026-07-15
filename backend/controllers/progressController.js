const Progress = require('../models/Progress');

exports.updateProgress = async (req, res) => {
  const { videoId, lastPosition, completed } = req.body;
  try {
    let progress = await Progress.findOne({ userId: req.user.id, videoId });
    if (progress) {
      progress.lastPosition = lastPosition;
      if (completed !== undefined) progress.completed = completed;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: req.user.id,
        videoId,
        lastPosition,
        completed: completed || false,
      });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id, videoId: req.params.videoId });
    if (progress) {
      res.json(progress);
    } else {
      res.json({ lastPosition: 0, completed: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
};

exports.getRecentlyWatched = async (req, res) => {
  try {
    const recent = await Progress.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('videoId')
      .limit(10);
    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recently watched' });
  }
};
