const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    // One-way hashing for password
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Simulated MFA: Second factor secret key, also hashed (Forward Secrecy concept)
    secretKeyHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    timestamps: true
});

// Instance Method to verify password (Reverse hash verification)
User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Instance Method to verify Secret Key (MFA)
User.prototype.matchSecretKey = async function(enteredSecretKey) {
    return await bcrypt.compare(enteredSecretKey, this.secretKeyHash);
};

module.exports = User;
