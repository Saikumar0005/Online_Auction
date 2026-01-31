const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); // Body parser

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('Bid & Win API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// SCALABILITY NOTE:
// This application is designed to be stateless. 
// Sessions are managed via JWT (stored on client), not server memory.
// This allows multiple instances of this Node server to run behind a Load Balancer (e.g., Nginx).
// State (Auctions, Bids, Users) is centralized in the MongoDB cluster.

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
