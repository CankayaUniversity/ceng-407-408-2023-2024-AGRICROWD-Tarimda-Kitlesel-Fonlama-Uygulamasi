const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/user', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const { name, email } = user;
        res.json({ name, email });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'An error occurred while fetching user data.' });
    }
});

module.exports = router;
