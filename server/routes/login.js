const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();

router.post(
  '/',
  [body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz.')],
  async (req, res) => {
    const { email, password, recaptchaValue } = req.body;
    try {
      const recaptchaVerification = await axios.post(
        'http://localhost:3001/api/recaptcha',
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
