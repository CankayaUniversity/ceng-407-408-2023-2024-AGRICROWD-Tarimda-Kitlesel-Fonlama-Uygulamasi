const express = require('express');
const router = express.Router();
const UserModel = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/:userId', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı');
        }

        
        const { password, ...otherDetails } = user._doc;
        res.status(200).json(otherDetails);
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});


router.put('/:userId', async (req, res) => {
    const updates = req.body;

    
    delete updates.password;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.userId, {
            $set: updates,
        }, { new: true });
        
        updatedUser.password = undefined;
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı güncellenirken bir hata oluştu' });
    }
});

module.exports = router; 