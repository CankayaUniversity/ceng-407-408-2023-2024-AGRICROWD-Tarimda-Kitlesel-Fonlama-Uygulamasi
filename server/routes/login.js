const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth API's
 *   description: Endpoints for authentication
 */

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - Auth API's
 *     summary: User login
 *     description: Authenticate user with email and password along with reCAPTCHA validation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: yourpassword123
 *               recaptchaValue:
 *                 type: string
 *                 description: reCAPTCHA response token.
 *                 example: 03AGdBq26_JG05gfUtnL...
 *     responses:
 *       200:
 *         description: Successfully authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 authToken:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: reCAPTCHA validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: reCAPTCHA validation failed!
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: No record exists with this email!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Internal Server Error!
 */

router.post(
  '/',
  [body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz.')],
  async (req, res) => {
    const { email, password, recaptchaValue } = req.body;
    try {
      const recaptchaVerification = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/api/recaptcha`,
        { recaptchaValue }
      );
      if (recaptchaVerification.data.success) {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          bcrypt
            .compare(password, user.password)
            .then((match) => {
              if (match) {
                const authToken = jwt.sign(
                  { userId: user._id, email: user.email },
                  process.env.JWT_SECRET,
                  { expiresIn: '1h' }
                );
                res.json({ success: true, authToken });
              } else {
                res
                  .status(401)
                  .json({ errors: ['The password is incorrect!'] });
              }
            })
            .catch((err) => {
              console.error(err);
              res
                .status(500)
                .json({ errors: ['Internal Login Server Error!'] });
            });
        } else {
          res
            .status(401)
            .json({ errors: ['No record exists with this email!'] });
        }
      } else {
        res.status(400).json({ errors: ['reCAPTCHA validation failed!'] });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ errors: ['Internal Server Error!'] });
    }
  }
);

module.exports = router;
