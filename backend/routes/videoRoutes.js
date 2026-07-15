const express = require('express');
const router = express.Router();
const { getVideos, getVideoById, getRelatedYouTubeVideos } = require('../controllers/videoController');

router.get('/', getVideos);
router.get('/:id', getVideoById);
router.get('/youtube/related/:videoId', getRelatedYouTubeVideos);

module.exports = router;
