const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const axios = require('axios');
const UserModel = require('../models/User');
const Project = require('../models/ProjectsSchema');

/**
 * @swagger
 * tags:
 *   name: User API's
 *   description: Endpoints for managing user information and projects
 */

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     tags:
 *       - User API's
 *     summary: Get user information
 *     description: Retrieve user information by user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get('/:userId', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }
        const { password, ...otherDetails } = user._doc;
        res.status(200).json(otherDetails);
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı bilgileri alınırken sunucu hatası oluştu', details: error.message });
    }
});
/**
 * @swagger
 * /api/user/update-info:
 *   put:
 *     tags:
 *       - User API's
 *     summary: Update user information
 *     description: Update user information by user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               updates:
 *                 type: object
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.put('/update-info', async (req, res) => {
    const { updates, userId } = req.body;

    if (!updates || !userId) {
        return res.status(400).json({ error: 'Güncellemeler veya kullanıcı ID eksik.' });
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updates }, { new: true });
        updatedUser.password = undefined; // Şifreyi döndürmemek için
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı güncellenirken bir hata oluştu', details: error.message });
    }
});

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     tags:
 *       - User API's
 *     summary: Change user password
 *     description: Change the password of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Invalid credentials or unauthorized
 *       500:
 *         description: Internal server error
 */

router.put('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const authToken = req.headers.authorization;

    try {
        const tokenResponse = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/auth`, {}, {
            headers: { Authorization: authToken }
        });
        if (tokenResponse.data.success) {
            const userId = tokenResponse.data.user._id;
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
            }
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ errors: ['Geçersiz kullanıcı adı veya şifre.'] });
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            return res.json({ success: true, message: 'Şifre başarıyla güncellendi.' });
        } else {
            return res.status(401).json({ errors: ['Oturum bilgileri geçersiz.'] });
        }
    } catch (error) {
        console.error('Şifre güncelleme hatası:', error);
        res.status(500).json({ errors: ['Bir hata oluştu.'] });
    }
});

/**
 * @swagger
 * /api/user/projects/fetch-approved-projects:
 *   get:
 *     tags:
 *       - User API's
 *     summary: Fetch approved projects for a user
 *     description: Retrieve approved projects for a specific user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve projects for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Approved projects retrieved successfully
 *       404:
 *         description: No projects found
 *       500:
 *         description: Internal server error
 */

//getprojectforuser
router.get('/projects/fetch-approved-projects', async (req, res) => {
    const userId = req.query.userId;

    try {
        const projects = await Project.find({ userId, status: 'approved' })
            .populate({
                path: 'category.mainCategory',
                model: 'Category',
                select: 'categoryName'
            })
            .populate({
                path: 'category.subCategory',
                model: 'SubCategory',
                select: 'subCategoryName'
            });
        if (projects.length === 0) {
            return res.status(404).json({ error: 'No projects found' });
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching projects', details: error.message });
    }
});

/**
 * @swagger
 * /api/user/projects/fetch-inactive-projects:
 *   get:
 *     tags:
 *       - User API's
 *     summary: Fetch inactive projects for a user
 *     description: Retrieve inactive projects for a specific user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve projects for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inactive projects retrieved successfully
 *       404:
 *         description: No projects found
 *       500:
 *         description: Internal server error
 */

router.get('/projects/fetch-inactive-projects', async (req, res) => {
    const userId = req.query.userId;

    try {
        const projects = await Project.find({ userId, status: { $ne: 'approved' } })
            .populate({
                path: 'category.mainCategory',
                model: 'Category',
                select: 'categoryName'
            })
            .populate({
                path: 'category.subCategory',
                model: 'SubCategory',
                select: 'subCategoryName'
            });
        if (projects.length === 0) {
            return res.status(404).json({ error: 'No projects found' });
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching projects', details: error.message });
    }
});

module.exports = router;

