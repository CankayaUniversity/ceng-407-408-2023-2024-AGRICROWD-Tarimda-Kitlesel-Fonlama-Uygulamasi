const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const Admin = require('../models/Admin');
const PendingProject = require('../models/ProjectsSchema');


router.post('/login', async (req, res) => {
    const { username, password, recaptchaValue } = req.body;
    try {
        const recaptchaVerification = await axios.post('http://localhost:3001/api/recaptcha', { recaptchaValue });
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

router.put('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const authToken = req.headers.authorization;
    try {
        const tokenResponse = await axios.post('http://localhost:3001/api/admin/verify-token', null, {
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


//projects side

router.post('/projects/add-pending', async (req, res) => {
    try {
        const { userId, basicInfo } = req.body;
        const newPendingProject = new PendingProject({
            userId,
            basicInfo
        });
        await newPendingProject.save();
        res.status(201).json({ success: true, message: 'Project submitted for approval successfully! You are directed to the screen where you can see your own projects...' });
    } catch (error) {
        console.error('Error submitting project for approval:', error);
        res.status(500).json({ message: 'An error occurred while submitting the project for approval. Please try again.' });
    }
});

router.get('/projects/pending', async (req, res) => {
    try {
        const pendingProjects = await PendingProject.find();
        res.status(200).json(pendingProjects);
    } catch (error) {
        console.error('Error fetching pending projects:', error);
        res.status(500).json({ message: 'An error occurred while fetching pending projects.' });
    }
});

router.put('/projects/approve', async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await PendingProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        } else {
            const currentDate = new Date();
            const expiredDate = new Date(currentDate.getTime() + project.basicInfo.campaignDuration * 24 * 60 * 60 * 1000);
            await PendingProject.findByIdAndUpdate(
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


router.put('/projects/reject', async (req, res) => {
    const { projectId, rejectionReason } = req.body;
    try {
        const updatedProject = await PendingProject.findByIdAndUpdate(
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





router.get('/projects/:projectId/photos', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await PendingProject.findById(projectId);
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
