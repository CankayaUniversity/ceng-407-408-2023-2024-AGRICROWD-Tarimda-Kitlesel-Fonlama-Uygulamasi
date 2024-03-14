const express = require('express');
const axios = require('axios');
const router = express.Router();

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
