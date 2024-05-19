const express = require('express');
const router = express.Router();
const axios = require('axios');
const Projects = require('../models/ProjectsSchema');

router.get('/fetch-approved-projects', async (req, res) => {
    try {
        const approvedProjects = await Projects.find({ status: 'approved' });
        res.status(200).json(approvedProjects);
    } catch (error) {
        console.error('Error fetching approved projects:', error);
        res.status(500).json({ message: 'An error occurred while fetching approved projects.' });
    }
});

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

router.post('/fetch-single-project', async (req, res) => {
    const { projectId } = req.body;
    const authToken = req.headers.authorization;
    let userId = null;

    if (!authToken) {
        return res.status(401).json({ success: false, message: "Authorization token not provided" });
    }

    try {
        const tokenResponse = await axios.post('http://localhost:3001/api/auth', {}, {
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

        if (project.userId !== userId) {
            return res.status(403).json({ success: false, message: "User does not have permission to access this project" });
        }

        res.status(200).json({ success: true, project });
    } catch (error) {
        console.error('Error while fetching project:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});




module.exports = router;