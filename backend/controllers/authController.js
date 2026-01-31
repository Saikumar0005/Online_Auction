const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password, secretKey } = req.body;

    // Use findOne with where clause in Sequelize
    const user = await User.findOne({ where: { email } });

    // Key Management - Reverse Hash Verification (Comparison Only)
    if (user && (await user.matchPassword(password))) {
        // MFA Concept: Verify the second factor (Secret Key)
        if (await user.matchSecretKey(secretKey)) {
            res.json({
                _id: user.id, // Sequelize uses 'id', not '_id'
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid Secret Key (MFA Failed)' });
        }
    } else {
        res.status(401).json({ message: 'Invalid Email or Password' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, secretKey, role } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Key Management - Forward Secrecy & One-way Hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const secretKeyHash = await bcrypt.hash(secretKey, salt);

    const user = await User.create({
        name,
        email,
        passwordHash,
        secretKeyHash,
        role: role || 'user'
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'secretKey'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { authUser, registerUser, getUsers };
