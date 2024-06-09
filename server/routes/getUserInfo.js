const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Info API
 *   description: Endpoint for get info
 */

/**
 * @swagger
 * /api/info/user:
 *   post:
 *     tags:
 *       - User API's
 *     summary: Get user data by user ID
 *     description: Fetch user data based on the provided user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to fetch.
 *                 example: 60b8d6c72e35f72d78fcb040
 *     responses:
 *       200:
 *         description: Successfully fetched user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: User data.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60b8d6c72e35f72d78fcb040
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching user data.
 */

router.post('/user', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'An error occurred while fetching user data.' });
    }
});

module.exports = router;
