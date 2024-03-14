const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/user');
const axios = require('axios');
const router = express.Router();

router.post('/',
    [
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
    ],
    async (req, res) => {
        const { email, password, recaptchaValue } = req.body;
        try {
            const recaptchaVerification = await axios.post('http://localhost:3001/api/recaptcha', { recaptchaValue });
            if (recaptchaVerification.data.success) {
                const existingUser = await UserModel.findOne({ email: email });
                if (existingUser) {
                    return res.status(400).json({ errors: ['Bu e-posta adresi zaten kullanılmaktadır.'] });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await UserModel.create({
                    email: email,
                    password: hashedPassword,
                });

                res.json(newUser);
            } else {
                res.status(400).json({ errors: ['reCAPTCHA validation failed'] });
            }
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ errors: ['Internal Server Error'] });
        }
    });

module.exports = router;
