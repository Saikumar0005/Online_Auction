const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
const placeBid = async (req, res) => {
    const { auctionId, amount } = req.body;

    const auction = await Auction.findByPk(auctionId);

    if (!auction) {
        res.status(404).json({ message: 'Auction not found' });
        return;
    }

    if (auction.status !== 'LIVE') {
         res.status(400).json({ message: 'Auction has ended' });
         return;
    }

    if (new Date() > new Date(auction.endTime)) {
        res.status(400).json({ message: 'Auction time expired' });
        return;
    }

    // Ensure amount is number
    const bidAmount = Number(amount);
    const currentPrice = Number(auction.currentPrice);

    if (bidAmount <= currentPrice) {
        res.status(400).json({ message: 'Bid must be higher than current price' });
        return;
    }

    const bid = await Bid.create({
        auctionId: auction.id,
        userId: req.user.id,
        amount: bidAmount
    });

    // Update auction current price
    auction.currentPrice = bidAmount;
    await auction.save();

    // Notify Creator
    if (auction.createdBy && auction.createdBy !== req.user.id) {
         await createNotification(auction.createdBy, `New bid of ₹${bidAmount} on your auction "${auction.title}"`);
    }

    // Notify Bidder
    await createNotification(req.user.id, `You placed a bid of ₹${bidAmount} on "${auction.title}"`);

    console.log(`[NOTIFICATION] New Bid Placed on ${auction.title} by ${req.user.name}: ₹${bidAmount}`);

    res.status(201).json(bid);
};

// @desc    Get bids for an auction
// @route   GET /api/bids/:auctionId
// @access  Public
const getBids = async (req, res) => {
    const bids = await Bid.findAll({
        where: { auctionId: req.params.auctionId },
        include: [{ 
            model: User, 
            attributes: ['name'] 
        }],
        order: [['amount', 'DESC']]
    });
    
    // Format for frontend
    const formattedBids = bids.map(bid => {
        const plainBid = bid.get({ plain: true });
        return {
            ...plainBid,
            userId: {
                _id: plainBid.User.id,
                name: plainBid.User.name
            },
            _id: plainBid.id
        };
    });

    res.json(formattedBids);
};

// @desc    Get ALL bids (Admin)
// @route   GET /api/bids/admin/all
// @access  Private/Admin
const getAllBids = async (req, res) => {
    try {
        const bids = await Bid.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Auction, attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { placeBid, getBids, getAllBids };
