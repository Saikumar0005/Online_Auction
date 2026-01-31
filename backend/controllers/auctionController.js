const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User');
const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Fetch all auctions
// @route   GET /api/auctions
// @access  Public
const getAuctions = async (req, res) => {
    // Lazy expiration check
    const now = new Date();
    const expiredAuctions = await Auction.findAll({
        where: {
            status: 'LIVE',
            endTime: { [Op.lt]: now }
        }
    });

    for (const auction of expiredAuctions) {
        await closeAuction(auction);
    }

    // Returning normal id, but may need to map to _id for frontend compatibility if not changed on frontend
    const auctions = await Auction.findAll({
        order: [['createdAt', 'DESC']]
    });
    
    // Map id to _id for React Frontend compatibility
    const response = auctions.map(a => {
        const json = a.toJSON();
        return { ...json, _id: json.id };
    });

    res.json(response);
};

// @desc    Fetch single auction
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionById = async (req, res) => {
    let auction = await Auction.findByPk(req.params.id, {
        include: [
            { model: User, as: 'winner', attributes: ['name', 'id'] }
        ]
    });

    if (auction) {
        if (auction.status === 'LIVE' && new Date() > new Date(auction.endTime)) {
            auction = await closeAuction(auction);
            // Reload to get winner info
            auction = await Auction.findByPk(req.params.id, {
                include: [{ model: User, as: 'winner', attributes: ['name', 'id'] }]
            });
        }
        
        // Frontend Compat
        const json = auction.toJSON();
        json._id = json.id;
        if(json.winner) json.winner._id = json.winner.id;
        
        res.json(json);
    } else {
        res.status(404).json({ message: 'Auction not found' });
    }
};

// @desc    Create an auction
// @route   POST /api/auctions
// @access  Private/Admin
const createAuction = async (req, res) => {
    const { title, description, startingPrice, startTime, endTime } = req.body;
    
    let imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const auction = await Auction.create({
        title,
        description,
        startingPrice,
        currentPrice: startingPrice,
        startTime,
        endTime,
        imageUrl,
        createdBy: req.user.id
    });

    console.log(`[NOTIFICATION] New Auction Started: ${auction.title}`);
    
    const json = auction.toJSON();
    json._id = json.id;
    res.status(201).json(json);
};

// Helper function to close auction
const closeAuction = async (auction) => {
    // Find highest bid
    const highestBid = await Bid.findOne({
        where: { auctionId: auction.id },
        order: [['amount', 'DESC']]
    });

    auction.status = 'ENDED';
    let winnerId = null;

    if (highestBid) {
        winnerId = highestBid.userId;
        auction.currentPrice = highestBid.amount;
        auction.winnerId = winnerId;
        
        console.log(`[NOTIFICATION] Auction Ended: ${auction.title}. Winner: User ID ${winnerId}`);
    } else {
         console.log(`[NOTIFICATION] Auction Ended: ${auction.title}. No bids received.`);
    }

    await auction.save();
    return auction;
};

// @desc    Get Auction Analytics
// @route   GET /api/auctions/analytics/stats
// @access  Private
const getAuctionStats = async (req, res) => {
    try {
        const totalAuctions = await Auction.count();

        // Average Bid
        const avgBidResult = await Bid.findOne({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('amount')), 'avgAmount']]
        });
        const averageBidValue = avgBidResult?.get('avgAmount') ? parseFloat(avgBidResult.get('avgAmount')) : 0;

        // Top Bidders
        // SQL: SELECT userId, COUNT(*) as totalBids, MAX(amount) as maxBid FROM Bids GROUP BY userId ORDER BY totalBids DESC LIMIT 5
        // Sequelize group by includes requires columns in group or aggregation
        const topBidders = await Bid.findAll({
            attributes: [
                'userId',
                [Sequelize.fn('COUNT', Sequelize.col('Bid.id')), 'totalBids'], // Specify table name to be safe
                [Sequelize.fn('MAX', Sequelize.col('amount')), 'maxBid']
            ],
            group: ['userId', 'User.id', 'User.name'], 
            include: [{
                model: User,
                attributes: ['name']
            }],
            order: [[Sequelize.literal('"totalBids"'), 'DESC']],
            limit: 5
        });
        
        // Format for frontend
        const formattedBidders = topBidders.map(b => ({
            name: b.User.name,
            totalBids: b.get('totalBids'),
            maxBid: b.get('maxBid')
        }));

        res.json({
            totalAuctions,
            averageBidValue,
            topBidders: formattedBidders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get auctions user participated in
// @route   GET /api/auctions/my-auctions
// @access  Private
const getMyAuctions = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Auctions where user has bid
        const userBids = await Bid.findAll({
            where: { bidderId: userId },
            attributes: ['auctionId'],
            group: ['auctionId']
        });
        
        const biddedAuctionIds = userBids.map(b => b.auctionId);

        const auctions = await Auction.findAll({
            where: {
                [Op.or]: [
                    { createdBy: userId },
                    { id: { [Op.in]: biddedAuctionIds } },
                    { winnerId: userId }
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        // Map id to _id
        const response = auctions.map(a => {
            const json = a.toJSON();
            return { ...json, _id: json.id };
        });
        
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAuctions, getAuctionById, createAuction, getAuctionStats, getMyAuctions };
