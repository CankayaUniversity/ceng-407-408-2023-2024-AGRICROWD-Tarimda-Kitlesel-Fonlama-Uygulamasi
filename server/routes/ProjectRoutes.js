const express = require('express');
const router = express.Router();
const PendingProject = require('../models/pendingProjectsSchema');

router.get('/fetch-approved-projects', async (req, res) => {
    try {
        const approvedProjects = await PendingProject.find({ status: 'approved' });
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
            return res.status(400).json({ success:false, message: 'Project ID is not specified.' });
        }

        const approvedProject = await PendingProject.findOne({ _id: projectId, status: 'approved' });
        if (!approvedProject) {
            return res.status(404).json({ success:false,message: 'Project not found.' });
        }
        res.status(200).json(approvedProject);
    } catch (error) {
        console.error('Error fetching approved project:', error);
        res.status(500).json({ success:false, message: 'An error occurred while fetching the approved project.' });
    }
});



module.exports = router;