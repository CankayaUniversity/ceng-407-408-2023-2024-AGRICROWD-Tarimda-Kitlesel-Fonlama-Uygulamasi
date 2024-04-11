import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import styles from './SignUp.module.css';
import Logo from '../Logo/Logo';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowerCase: false,
    hasUpperCase: false,
    hasSpecialChar: false,
    isLengthValid: false,
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
      isLengthValid,
    });

    setPassword(newPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log('Passwords do not match.');
      return;
    }

    axios
      .post('http://localhost:3001/api/register', {
        name,
        email,
        password,
        recaptchaValue,
      })
      .then((response) => {
        if (response.status === 200) {
          window.alert('Registration successful!');
          navigate('/login');
        } else {
          console.log('Registration failed:', response.data);
          window.alert('Registration failed. Please try again.');
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errors) {
          const serverErrors = err.response.data.errors;
          console.error('Server error message:', serverErrors);
        } else if (err.response) {
          console.error('Server error message:', err.response.data);
        } else if (err.request) {
          console.error('Request error:', err.request);
        } else {
          console.error('General error:', err.message);
        }
      });
  };

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.leftContainer}>
        <Link to='/'>
          <Logo heading={false} />
        </Link>
        <p className={styles.sidebarText}>Welcome to AgriCrowd</p>
        <p className={styles.sidebarTitle}>Create an account</p>
      </div>

      <div className={styles.rightContainer}>
        <header className={styles.formHeader}>
          <p>
            Already have an account?&nbsp;
            <Link to='/login' className={styles.formSubLink}>
              Sign in
            </Link>
          </p>
        </header>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Your account details</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formRowInner}>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className={styles.input}
                  autoComplete='off'
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label className={styles.label} htmlFor='name'>
                  Name
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formRowInner}>
                <input
                  type='email'
                  name='email'
                  id='email'
                  autoComplete='off'
                  className={styles.input}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className={styles.label} htmlFor='email'>
                  Email
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formRowInner}>
                <input
                  type='password'
                  name='password'
                  id='password'
                  className={styles.input}
                  onChange={handlePasswordChange}
                  required
                />
                <label className={styles.label} htmlFor='password'>
                  Password
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formRowInner}>
                <input
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  className={styles.input}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label className={styles.label} htmlFor='confirmPassword'>
                  Confirm Password
                </label>
              </div>
            </div>

            <div className={styles.validationContainer}>
              <p style={{ marginBottom: '0.5rem' }}>Your password must have:</p>

              <div className={styles.requirements}>
                <div className={styles.requirement}>
                  {' '}
                  {passwordStrength.isLengthValid ? (
                    <img src='/images/check.svg' alt='Check Mark' />
                  ) : (
                    <img src='/images/cross.svg' alt='Cross Mark' />
                  )}
                  At least 6 characters long
                </div>
                <div className={styles.requirement}>
                  {passwordStrength.hasLowerCase ? (
                    <img src='/images/check.svg' alt='Check Mark' />
                  ) : (
                    <img src='/images/cross.svg' alt='Cross Mark' />
                  )}
                  1 lowercase letter
                </div>
                <div className={styles.requirement}>
                  {passwordStrength.hasUpperCase ? (
                    <img src='/images/check.svg' alt='Check Mark' />
                  ) : (
                    <img src='/images/cross.svg' alt='Cross Mark' />
                  )}
                  1 uppercase letter
                </div>
                <div className={styles.requirement}>
                  {passwordStrength.hasNumber ? (
                    <img src='/images/check.svg' alt='Check Mark' />
                  ) : (
                    <img src='/images/cross.svg' alt='Cross Mark' />
                  )}
                  1 number
                </div>
                <div className={styles.requirement}>
                  {passwordStrength.hasSpecialChar ? (
                    <img src='/images/check.svg' alt='Check Mark' />
                  ) : (
                    <img src='/images/cross.svg' alt='Cross Mark' />
                  )}
                  1 special character
                </div>
              </div>
            </div>

            <div>
              <ReCAPTCHA
                sitekey='6LdYdJIpAAAAACdHw2Hipmtpk0U7nzv0hhtIHXmb'
                onChange={handleRecaptchaChange}
              />
            </div>

            <button type='submit' className={styles.button}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
