const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (!token || token === 'undefined' || token === 'null') {
                 throw new Error('Token missing or invalid string');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find by Primary Key in Sequelize
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['passwordHash', 'secretKeyHash'] }
            });

            if (!user) {
                throw new Error('User not found');
            }
            
            req.user = user;
            next();
        } catch (error) {
            console.error(`[Auth Middleware] Error: ${error.message}`);
            // console.error(error); // Uncomment for debugging full stack trace
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
