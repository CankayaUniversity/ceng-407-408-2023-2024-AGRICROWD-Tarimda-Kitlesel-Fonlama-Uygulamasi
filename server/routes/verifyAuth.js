const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth API's
 *   description: Endpoints for user authentication and authorization
 */

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - Auth API's
 *     summary: Verify user authentication token
 *     description: Verify the provided JWT and return user information if the token is valid.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *       401:
 *         description: Auth token not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Auth token not provided"]
 *       404:
 *         description: User not found
 *         content:
 *           application/json
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["User not found"]
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Internal Server Error"]
 */
router.post('/', async (req, res) => {
    const authToken = req.headers.authorization;
    try {
        if (!authToken) {
            return res.status(401).json({ success: false, errors: ['Auth token not provided'] });
        }
        const token = authToken.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
