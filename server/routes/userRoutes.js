const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const axios = require('axios');
const UserModel = require('../models/User');
const PendingProject = require('../models/ProjectsSchema');


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
router.get('/projects/:userId', async (req, res) => {
    
    const userId = req.params.userId;
    
    try {
        const projects = await PendingProject.find({ userId });
        if (projects.length === 0) {
            return res.status(404).json({ error: 'Projeler bulunamadı' });
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Projeler yüklenirken bir hata oluştu', details: error.message });
    }
});
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



router.put('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const authToken = req.headers.authorization;
    try {
        const tokenResponse = await axios.post('http://localhost:3001/api/auth', {}, {
            headers: { Authorization: authToken }
        });
        if (tokenResponse.data.success) {
            const userId = tokenResponse.data.user._id;
            const user = await UserModel.findById(userId); // ObjectId doğru kullanımı
            if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
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
module.exports = router;

