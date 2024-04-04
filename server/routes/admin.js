const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();

const Admin = require('../models/Admin');
const PendingProject = require('../models/pendingProjectsSchema');


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
    const { oldPassword, newPassword, token } = req.body;
    try {
        const tokenResponse = await axios.post('http://localhost:3001/api/admin/verify-token', { token });
        if (!tokenResponse.data.success) {
            return res.status(401).json({ errors: ['Oturum bilgileri geçersiz.'] });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const username = decodedToken.username;
        const admin = await Admin.findOne({ username });
        if (!admin || !(await bcrypt.compare(oldPassword, admin.password))) {
            return res.status(401).json({ errors: ['Geçersiz kullanıcı adı veya şifre.'] });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;
        await admin.save();
        res.json({ success: true, message: 'Şifre başarıyla güncellendi.' });
    } catch (error) {
        console.error('Şifre güncelleme hatası:', error);
        res.status(500).json({ errors: ['Bir hata oluştu.'] });
    }
});

router.post('/verify-token', async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ username: decodedToken.username });
        if (admin) {
            res.json({ success: true });
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
        res.status(201).json({ success: true, message: 'Project submitted for approval successfully!' });
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

router.put('/projects/reject', async (req, res) => {
    const { projectId, rejectionReason } = req.body;
    try {
        const updatedProject = await PendingProject.findByIdAndUpdate(
            projectId,
            { rejectionReason, status: 'rejected' },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(updatedProject);
    } catch (error) {
        console.error('Error rejecting project:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
