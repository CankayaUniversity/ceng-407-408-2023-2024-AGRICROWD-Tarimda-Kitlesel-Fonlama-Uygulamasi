const express = require('express');
const router = express.Router();
const PendingProject = require('../models/pendingProjectsSchema');

router.get('/', async (req, res) => {
    try {
        const approvedProjects = await PendingProject.find({ status: 'approved' });
        res.status(200).json(approvedProjects);
    } catch (error) {
        console.error('Error fetching approved projects:', error);
        res.status(500).json({ message: 'An error occurred while fetching approved projects.' });
    }
});

module.exports = router;