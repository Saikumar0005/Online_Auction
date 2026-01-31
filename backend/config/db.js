const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URI || 'postgresql://postgres:9381886983%40Sai@localhost:5432/bid_win_auction', {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected successfully.');
        
        // Sync models
        await sequelize.sync({ alter: true }); // Use { force: true } to drop tables
        console.log('Database Synced');
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
