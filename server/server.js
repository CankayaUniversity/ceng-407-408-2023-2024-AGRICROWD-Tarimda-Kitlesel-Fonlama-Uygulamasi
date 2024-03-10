const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require("cors");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');  
const { body, validationResult } = require('express-validator');
require('dotenv').config({ path: './.env' });

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const UserModel = mongoose.model('User', userSchema);

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

app.post('/verify-recaptcha', async (req, res) => {
    const { recaptchaValue } = req.body;

    try {
        const recaptchaResponse = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        if (recaptchaResponse.data.success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, errors: ["reCAPTCHA validation failed"] });
        }
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
});

app.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const { email, password, recaptchaValue } = req.body;

    try {
        const recaptchaVerification = await axios.post('http://localhost:3001/verify-recaptcha', { recaptchaValue });

        if (recaptchaVerification.data.success) {
            const existingUser = await UserModel.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ errors: ["Bu e-posta adresi zaten kullanılmaktadır."] });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({
                email: email,
                password: hashedPassword
            });
            res.json(newUser);
        } else {
            res.status(400).json({ errors: ["reCAPTCHA validation failed"] });
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ errors: ["Internal Server Error"] });
    }
});

app.post("/login", async (req, res) => {
    const { email, password, recaptchaValue } = req.body;

    try {
        const recaptchaVerification = await axios.post('http://localhost:3001/verify-recaptcha', { recaptchaValue });
        if (recaptchaVerification.data.success) {
            const user = await UserModel.findOne({ email: email });
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(match => {
                        if (match) {
                            console.log("UserID:", user._id)
                            const authToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                            const sessionID = uuidv4();
                            res.json({ authToken, sessionID });
                        } else {
                            res.status(401).json({ errors: ["The password is incorrect"] });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ errors: ["Internal Login Server Error"] });
                    });
            } else {
                res.status(401).json({ errors: ["No record exists with this email"] });
            }
        } else {
            res.status(400).json({ errors: ["reCAPTCHA validation failed"] });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ errors: ["Internal Server Error"] });
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
