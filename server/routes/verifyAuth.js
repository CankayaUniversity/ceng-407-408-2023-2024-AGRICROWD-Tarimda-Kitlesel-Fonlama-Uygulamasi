const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
    const authToken = req.body.authToken;
    console.log("Received authToken:", authToken);

    try {
        if (!authToken) {
            return res.status(401).json({ success: false, errors: ['Auth token not provided'] });
        }
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log("Decoded userId:", decoded.userId);
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, errors: ['User not found'] });
        }
        res.json({ success: true, user: user });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
});

module.exports = router;
