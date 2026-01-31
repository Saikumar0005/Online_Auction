const express = require('express');
const router = express.Router();
const { placeBid, getBids, getAllBids } = require('../controllers/bidController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, placeBid);

router.get('/admin/all', protect, admin, getAllBids);

router.route('/:auctionId')
    .get(getBids);

module.exports = router;
