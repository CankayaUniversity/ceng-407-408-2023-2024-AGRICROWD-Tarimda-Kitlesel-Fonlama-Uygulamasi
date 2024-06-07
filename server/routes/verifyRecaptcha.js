const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: reCAPTCHA API's
 *   description: Endpoints for reCAPTCHA verification
 */

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - reCAPTCHA API's
 *     summary: Verify reCAPTCHA token
 *     description: Validate reCAPTCHA token with Google reCAPTCHA API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recaptchaValue:
 *                 type: string
 *                 example: "03AGdBq24..."
 *     responses:
 *       200:
 *         description: reCAPTCHA validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: reCAPTCHA validation failed
 *         content:
 *           application/json
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["reCAPTCHA validation failed"]
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Internal Server Error"]
 */
router.post('/', async (req, res) => {
    const { recaptchaValue } = req.body;
    try {
        const recaptchaResponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (recaptchaResponse.data.success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, errors: ['reCAPTCHA validation failed'] });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
});

module.exports = router;
