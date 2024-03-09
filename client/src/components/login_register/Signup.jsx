import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import './Signup.css';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({
        hasLowerCase: false,
        hasUpperCase: false,
        hasSpecialChar: false,
        isLengthValid: false
    });
    const navigate = useNavigate();
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;

        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        const hasNumber = /\d/.test(newPassword);
        const isLengthValid = newPassword.length >= 6;

        setPasswordStrength({
            hasLowerCase,
            hasUpperCase,
            hasSpecialChar,
            hasNumber,
            isLengthValid
        });

        setPassword(newPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            console.log("Passwords do not match.");
            return;
        }

        axios.post('http://localhost:3001/register', { name, email, password, recaptchaValue })
            .then(response => {
                if (response.status === 200) {
                    console.log("Registration successful!");
                    window.alert("Registration successful!");
                    navigate('/login');
                } else {
                    console.log("Registration failed:", response.data);
                    window.alert("Registration failed. Please try again.");
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.errors) {
                    const serverErrors = err.response.data.errors;
                    console.error("Server error message:", serverErrors);
                } else if (err.response) {
                    console.error("Server error message:", err.response.data);
                } else if (err.request) {
                    console.error("Request error:", err.request);
                } else {
                    console.error("General error:", err.message);
                }
            });
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>REGISTER</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">
                            <strong>Name</strong>
                        </label>
                        <input type="text" name="name" placeholder="Enter Name" autoComplete="off" className="form-control rounded-0" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input type="text" placeholder="Enter Email" autoComplete="off" name="email" className="form-control rounded-0" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={handlePasswordChange}
                        />
                        <div className="password-strength">
                            <span className={`strength-indicator lower-case ${passwordStrength.hasLowerCase ? 'valid' : 'invalid'}`}>&#10004;</span>
                            <span className={`strength-indicator upper-case ${passwordStrength.hasUpperCase ? 'valid' : 'invalid'}`}>&#10004;</span>
                            <span className={`strength-indicator special-char ${passwordStrength.hasSpecialChar ? 'valid' : 'invalid'}`}>&#10004;</span>
                            <span className={`strength-indicator number ${passwordStrength.hasNumber ? 'valid' : 'invalid'}`}>&#10004;</span>
                            <span className={`strength-indicator length ${passwordStrength.isLengthValid ? 'valid' : 'invalid'}`}>&#10004;</span>
                        </div>
                        <div className="password-requirements">
                            <span className={`requirement ${passwordStrength.hasLowerCase ? 'valid' : 'invalid'}`}>En az bir küçük harf</span>
                            <span className={`requirement ${passwordStrength.hasUpperCase ? 'valid' : 'invalid'}`}>En az bir büyük harf</span>
                            <span className={`requirement ${passwordStrength.hasSpecialChar ? 'valid' : 'invalid'}`}>En az bir özel karakter</span>
                            <span className={`requirement ${passwordStrength.hasNumber ? 'valid' : 'invalid'}`}>En az bir rakam</span>
                            <span className={`requirement ${passwordStrength.isLengthValid ? 'valid' : 'invalid'}`}>Minimum 6 karakter uzunluğu</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword">
                            <strong>Confirm Password</strong>
                        </label>
                        <input type="password" placeholder="Confirm Password" name="confirmPassword" className="form-control rounded-0" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div>
                        <ReCAPTCHA
                            sitekey="6LdYdJIpAAAAACdHw2Hipmtpk0U7nzv0hhtIHXmb"
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                    <button type="submit" className="btn w-100 rounded-0">
                        Register
                    </button>
                </form>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Signup;
