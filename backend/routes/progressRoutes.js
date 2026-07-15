const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, getRecentlyWatched } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, updateProgress);

router.route('/recent')
  .get(protect, getRecentlyWatched);

router.route('/:videoId')
  .get(protect, getProgress);

module.exports = router;
