const Bookmark = require('../models/Bookmark');

exports.createBookmark = async (req, res) => {
  const { videoId, bookmarkName, timestamp } = req.body;
  try {
    const bookmark = await Bookmark.create({
      userId: req.user.id,
      videoId,
      bookmarkName,
      timestamp,
    });
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create bookmark' });
  }
};

exports.getBookmarksByVideo = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id, videoId: req.params.videoId }).sort({ timestamp: 1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
};

exports.updateBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });
    
    if (bookmark.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    bookmark.bookmarkName = req.body.bookmarkName || bookmark.bookmarkName;
    const updatedBookmark = await bookmark.save();
    res.json(updatedBookmark);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update bookmark' });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });

    if (bookmark.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await bookmark.deleteOne();
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete bookmark' });
  }
};
