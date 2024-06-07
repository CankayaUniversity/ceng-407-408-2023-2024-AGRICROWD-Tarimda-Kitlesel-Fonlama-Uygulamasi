const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();

const Admin = require('../models/Admin');
const Project = require('../models/ProjectsSchema');

/**
 * @swagger
 * tags:
 *   name: Admin API's
 *   description: Admin management and project approval endpoints
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Login admin with username, password and reCAPTCHA value
 *     parameters:
 *       - in: body
 *         name: admin
 *         description: Admin login credentials
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *             - recaptchaValue
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *             recaptchaValue:
 *               type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: reCAPTCHA validation failed
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: An error occurred
 */
router.post('/login', async (req, res) => {
    const { username, password, recaptchaValue } = req.body;
    try {
        const recaptchaVerification = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/recaptcha`, { recaptchaValue });
        if (!recaptchaVerification.data.success) {
            return res.status(400).json({ errors: ['reCAPTCHA validation failed'] });
        }
        if (!username || !password) {
            return res.status(400).json({ errors: ['Kullanıcı adı ve şifre gereklidir.'] });
        }
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ errors: ['Geçersiz kullanıcı adı veya şifre.'] });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ errors: ['Geçersiz kullanıcı adı veya şifre.'] });
        }
        const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ authToken: token });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ errors: ['Bir hata oluştu.'] });
    }
});

/**
 * @swagger
 * /api/admin/change-password:
 *   put:
 *     summary: Change admin password
 *     description: Change admin password
 *     parameters:
 *       - in: body
 *         name: password
 *         description: Old and new password
 *         schema:
 *           type: object
 *           required:
 *             - oldPassword
 *             - newPassword
 *           properties:
 *             oldPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: An error occurred
 */
router.put('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const authToken = req.headers.authorization;
    try {
        const tokenResponse = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/admin/verify-token`, null, {
            headers: { Authorization: authToken }
        });
        if (tokenResponse.data.success) {
            const username = tokenResponse.data.admin.username;
            const admin = await Admin.findOne({ username });
            if (!admin || !(await bcrypt.compare(oldPassword, admin.password))) {
                return res.status(401).json({ errors: ['Geçersiz kullanıcı adı veya şifre.'] });
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashedNewPassword;
            await admin.save();
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
 * /api/admin/verify-token:
 *   post:
 *     summary: Verify admin token
 *     description: Verify admin token
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Token verification successful
 *       401:
 *         description: Auth token not provided
 *       500:
 *         description: An error occurred
 */
router.post('/verify-token', async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ success: false, errors: ['Auth token not provided'] });
    }
    try {
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ username: decodedToken.username });
        if (admin) {
            res.json({ success: true, admin: admin });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        res.json({ success: false });
    }
});

/**
 * @swagger
 * /api/admin/projects/add-pending:
 *   post:
 *     summary: Add pending project
 *     description: Add a new pending project
 *     parameters:
 *       - in: body
 *         name: project
 *         description: Project details
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - basicInfo
 *             - category
 *           properties:
 *             userId:
 *               type: string
 *             basicInfo:
 *               type: object
 *             category:
 *               type: object
 *     responses:
 *       201:
 *         description: Project submitted for approval successfully
 *       500:
 *         description: An error occurred while submitting the project for approval
 */
router.post('/projects/add-pending', async (req, res) => {
    try {
        const { userId, basicInfo, category } = req.body;
        const newPendingProject = new Project({
            userId,
            basicInfo,
            category
        });
        await newPendingProject.save();
        res.status(201).json({ success: true, message: 'Project submitted for approval successfully! You are directed to the screen where you can see your own projects...' });
    } catch (error) {
        console.error('Error submitting project for approval:', error);
        res.status(500).json({ message: 'An error occurred while submitting the project for approval. Please try again.' });
    }
});

/**
 * @swagger
 * /api/admin/projects/pending:
 *   get:
 *     summary: Get pending projects
 *     description: Get all pending projects
 *     responses:
 *       200:
 *         description: A list of pending projects
 *       500:
 *         description: An error occurred while fetching pending projects
 */
router.get('/projects/pending', async (req, res) => {
    try {
        const pendingProjects = await Project.find({ status: 'pending' })
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
        res.status(200).json({ success: true, pendingProjects });
    } catch (error) {
        console.error('Error fetching pending projects:', error);
        res.status(500).json({ message: 'An error occurred while fetching pending projects.' });
    }
});

/**
 * @swagger
 * /api/admin/projects/approve:
 *   put:
 *     summary: Approve project
 *     description: Approve a pending project
 *     parameters:
 *       - in: body
 *         name: projectId
 *         description: Project ID
 *         schema:
 *           type: object
 *           required:
 *             - projectId
 *           properties:
 *             projectId:
 *               type: string
 *     responses:
 *       200:
 *         description: Project approved successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/projects/approve', async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        } else {
            const currentDate = new Date();
            const expiredDate = new Date(currentDate.getTime() + project.basicInfo.campaignDuration * 24 * 60 * 60 * 1000);
            await Project.findByIdAndUpdate(
                projectId,
                { status: 'approved', approvalDate: currentDate, expiredDate },
                { new: true }
            );
            res.json({ success: true, message: 'Project approved successfully!' });
        }
    } catch (error) {
        console.error('Error approving project:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/admin/projects/reject:
 *   put:
 *     summary: Reject project
 *     description: Reject a pending project
 *     parameters:
 *       - in: body
 *         name: project
 *         description: Project ID and rejection reason
 *         schema:
 *           type: object
 *           required:
 *             - projectId
 *             - rejectionReason
 *           properties:
 *             projectId:
 *               type: string
 *             rejectionReason:
 *               type: string
 *     responses:
 *       200:
 *         description: Project rejected successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/projects/reject', async (req, res) => {
    const { projectId, rejectionReason } = req.body;
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { rejectionReason, status: 'rejected' },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.json({ success: true, message: 'Project rejected successfully!' });
    } catch (error) {
        console.error('Error rejecting project:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/admin/projects/{projectId}/photos:
 *   get:
 *     summary: Get project photos
 *     description: Get photos of a project by project ID
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         type: string
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: A list of project photos
 *       404:
 *         description: Project not found
 *       500:
 *         description: An error occurred while fetching project photos
 */
router.get('/projects/:projectId/photos', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project.photos);
    } catch (error) {
        console.error('Error fetching project photos:', error);
        res.status(500).json({ message: 'An error occurred while fetching project photos.' });
    }
});

module.exports = router;
