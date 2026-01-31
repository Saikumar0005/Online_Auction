const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    const notifications = await Notification.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
};

// @desc    Mark as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    const notification = await Notification.findByPk(req.params.id);
    if (notification && notification.userId === req.user.id) {
        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
};

// Internal Helper to create notification
const createNotification = async (userId, message) => {
    try {
        await Notification.create({ userId, message });
    } catch (error) {
        console.error("Notification Error", error);
    }
};

module.exports = { getNotifications, markAsRead, createNotification };
