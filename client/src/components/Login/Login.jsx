import { React, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';

import styles from './Login.module.css';
import Logo from '../Logo/Logo';

axios.defaults.withCredentials = true;
function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const recaptchaRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = new URLSearchParams(location.search).get('returnUrl');

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };
  const resetRecaptcha = () => {
    recaptchaRef.current.reset();
    setRecaptchaValue(null);
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      console.log('reCAPTCHA validation failed');
      return;
    } else {
      console.log('reCAPTCHA validation success');
      axios
        .post(
          'http://localhost:3001/api/login',
          { email, password, recaptchaValue },
          { withCredentials: true }
        )
        .then((response) => {
          console.log('Server response is: ', response);
          if (response.status) {
            window.alert('You have successfully logged in!');
            Cookies.set('authToken', response.data.authToken, {
              expires: 1 / 24,
            });
            setTimeout(() => {
              console.log(returnUrl);
              if(returnUrl){
                navigate(returnUrl);
              } else {
                navigate(`/user/home`);
              }
              window.location.reload();
            }, 250);
          } else {
            window.alert('Server error!');
            resetRecaptcha();
          }
        })
        .catch((err) => {
          resetRecaptcha();
          if (err.response && err.response.data && err.response.data.errors) {
            setErrorMessage(err.response.data.errors[0]);
          } else {
            setErrorMessage('An unknown error occurred');
          }
        });
    }
  };
  return (
    <div className={styles.layoutContainer}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>User Login - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/login" />
      </Helmet>
      <div className={styles.leftContainer}>
        <Link to='/'>
          <Logo heading={false} />
        </Link>
        <p className={styles.sidebarText}>Welcome back</p>
        <p className={styles.sidebarTitle}>Sign in to AgriCrowd</p>
      </div>

      <div className={styles.rightContainer}>
        <header className={styles.formHeader}>
          <p>
            Don't have an account?&nbsp;
            <Link to='/register' className={styles.formSubLink}>
              Sign up
            </Link>
          </p>
        </header>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Your account details</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formRowInner}>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className={styles.input}
                  autoComplete='off'
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className={styles.label} htmlFor='password'>
                  Password
                </label>
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: '#e03131' }}>
                <span style={{ marginRight: '4px' }}>⛔</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey='6LdYdJIpAAAAACdHw2Hipmtpk0U7nzv0hhtIHXmb'
                onChange={handleRecaptchaChange}
              />
            </div>

            <span>
              <a className={styles.formSubLink}>Forgot your password?</a>
            </span>
            <span>
              <a className={styles.formSubLink} onClick={handleAdminLogin}>
                Admin login 🔏
              </a>
            </span>

            <button className={styles.button} type='submit'>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
