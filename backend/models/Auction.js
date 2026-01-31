const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Import User for association

const Auction = sequelize.define('Auction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    startingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('LIVE', 'ENDED', 'UPCOMING'),
        defaultValue: 'LIVE'
    },
    // Foreign Keys defined in associations usually, but can be explicit
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    winnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

// Associations
Auction.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Auction.belongsTo(User, { as: 'winner', foreignKey: 'winnerId' });

module.exports = Auction;
