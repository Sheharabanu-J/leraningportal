const express = require('express');
const router = express.Router();
const { createBookmark, getBookmarksByVideo, updateBookmark, deleteBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBookmark);

router.route('/:id')
  .put(protect, updateBookmark)
  .delete(protect, deleteBookmark);

router.route('/video/:videoId')
  .get(protect, getBookmarksByVideo);

module.exports = router;
