const express = require('express');
const router = express.Router();
const axios = require('axios');
const Projects = require('../models/ProjectsSchema');

/**
 * @swagger
 * tags:
 *   name: Projects API's
 *   description: Endpoints for managing projects
 */

/**
 * @swagger
 * 
 * /fetch-approved-projects:
 *   get:
 *     tags:
 *       - Projects API's
 *     summary: Fetch approved projects
 *     description: Retrieve a list of approved projects.
 *     responses:
 *       200:
 *         description: Successfully fetched approved projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60c72b2f5f1b2c001f6e4b3c
 *                   name:
 *                     type: string
 *                     example: "Project Name"
 *                   status:
 *                     type: string
 *                     example: "approved"
 *       500:
 *         description: An error occurred while fetching approved projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching approved projects.
 */
router.get('/fetch-approved-projects', async (req, res) => {
    try {
        const approvedProjects = await Projects.find({ status: 'approved' });
        res.status(200).json(approvedProjects);
    } catch (error) {
        console.error('Error fetching approved projects:', error);
        res.status(500).json({ message: 'An error occurred while fetching approved projects.' });
    }
});

/**
 * @swagger
 * /details:
 *   post:
 *     tags:
 *       - Projects API's
 *     summary: Get project details
 *     description: Retrieve details of a specific approved project by project ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f6e4b3c"
 *     responses:
 *       200:
 *         description: Successfully fetched project details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60c72b2f5f1b2c001f6e4b3c
 *                     name:
 *                       type: string
 *                       example: "Project Name"
 *                     status:
 *                       type: string
 *                       example: "approved"
 *       400:
 *         description: Project ID is not specified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Project ID is not specified.
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Project not found.
 *       500:
 *         description: An error occurred while fetching the approved project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching the approved project.
 */
router.post('/details', async (req, res) => {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ success: false, message: 'Project ID is not specified.' });
        }

        const approvedProject = await Projects.findOne({ _id: projectId, status: 'approved' })
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
        if (!approvedProject) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }
        res.status(200).json({ success: true, project: approvedProject });
    } catch (error) {
        console.error('Error fetching approved project:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the approved project.' });
    }
});

/**
 * @swagger
 * /fetch-single-project:
 *   post:
 *     tags:
 *       - Projects API's
 *     summary: Fetch single project by ID
 *     description: Retrieve a single project by its ID after verifying the user's authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f6e4b3c"
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer <your_token>"
 *     responses:
 *       200:
 *         description: Successfully fetched the project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60c72b2f5f1b2c001f6e4b3c
 *                     name:
 *                       type: string
 *                       example: "Project Name"
 *       401:
 *         description: Authorization token not provided or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Authorization token not provided
 *       403:
 *         description: User does not have permission to access this project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User does not have permission to access this project
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Project not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/fetch-single-project', async (req, res) => {
    const { projectId } = req.body;
    const authToken = req.headers.authorization;
    let userId = null;

    if (!authToken) {
        return res.status(401).json({ success: false, message: "Authorization token not provided" });
    }

    try {
        const tokenResponse = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/auth`, {}, {
            headers: { Authorization: authToken }
        });
        if (tokenResponse.data.success) {
            userId = tokenResponse.data.user._id;
        } else {
            return res.status(401).json({ errors: ['authToken Invalid.'] });
        }
    } catch (error) {
        res.status(500).json({ success: false, errors: ['Internal server error'] });
    }

    try {
        const project = await Projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "User does not have permission to access this project" });
        }

        res.status(200).json({ success: true, project });
    } catch (error) {
        console.error('Error while fetching project:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
