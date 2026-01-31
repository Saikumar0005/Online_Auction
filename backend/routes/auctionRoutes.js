const express = require('express');
const router = express.Router();
const { getAuctions, getAuctionById, createAuction, getAuctionStats, getMyAuctions } = require('../controllers/auctionController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getAuctions)
    .post(protect, admin, upload.single('image'), createAuction);

router.get('/my-auctions', protect, getMyAuctions);

router.route('/analytics/stats')
    .get(protect, getAuctionStats);

router.route('/:id')
    .get(getAuctionById);

module.exports = router;
