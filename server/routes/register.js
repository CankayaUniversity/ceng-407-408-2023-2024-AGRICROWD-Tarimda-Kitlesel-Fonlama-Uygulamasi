const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/User');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Register API
 *   description: Endpoint for registration
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - Register API
 *     summary: Register a new user
 *     description: Create a new user account after verifying reCAPTCHA and checking if the email is already in use.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               recaptchaValue:
 *                 type: string
 *                 example: "03AGdBq24..."
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f5f1b2c001f6e4b3c"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 password:
 *                   type: string
 *                   example: "$2b$10$XqVZb7ZyA5LJ7MxNpBBYgOhfFy1O..."
 *       400:
 *         description: Validation error or reCAPTCHA failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Bu e-posta adresi zaten kullanılmaktadır.", "reCAPTCHA validation failed"]
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Internal Server Error"]
 */
router.post('/',
    [
        body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz.'),
        body('password').isLength({ min: 5 }).withMessage('Şifre en az 5 karakter olmalıdır.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(err => err.msg) });
        }

        const { name, email, password, recaptchaValue } = req.body;
        try {
            const recaptchaVerification = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/recaptcha`, { recaptchaValue });
            if (recaptchaVerification.data.success) {
                const existingUser = await UserModel.findOne({ email: email });
                if (existingUser) {
                    return res.status(400).json({ errors: ['Bu e-posta adresi zaten kullanılmaktadır.'] });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await UserModel.create({
                    name: name,
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
