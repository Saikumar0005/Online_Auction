const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Auction = require('./Auction');

const Bid = sequelize.define('Bid', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: true
});

// Associations
Bid.belongsTo(User, { foreignKey: 'userId' });
Bid.belongsTo(Auction, { foreignKey: 'auctionId' });
User.hasMany(Bid, { foreignKey: 'userId' });
Auction.hasMany(Bid, { foreignKey: 'auctionId' });

module.exports = Bid;
