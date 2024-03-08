const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require("cors");
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/user");

const UserModel = mongoose.model('User', {
    email: String,
    password: String
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(match => {
                        if (match) {
                            res.json("Successful");
                        } else {
                            res.json("The password is incorrect");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json("Internal Server Error");
                    });
            } else {
                res.json("No record exist");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json("Internal Server Error");
        });
});

app.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            return UserModel.create({
                email: req.body.email,
                password: hash
            });
        })
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
    console.log("server is working");
});
