import { React, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import Cookies from 'js-cookie';

import styles from './AdminLogin.module.css';
import Logo from '../../Logo/Logo';

axios.defaults.withCredentials = true;

function AdminLogin() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };
  const resetRecaptcha = () => {
    recaptchaRef.current.reset();
    setRecaptchaValue(null);
  };

  useEffect(() => {
    const admToken = Cookies.get('admToken');
    if (admToken) {
      axios
        .post('http://localhost:3001/api/admin/verify-token', {
          token: admToken,
        })
        .then((response) => {
          if (response.data.success) {
            navigate(`/admin/home`);
          } else {
            console.log('Token could not be verified!');
          }
        })
        .catch((err) => {
          console.error('Token verification error:', err);
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      console.log('reCAPTCHA validation failed');
      return;
    } else {
      console.log('reCAPTCHA validation success');
      axios
        .post(
          'http://localhost:3001/api/admin/login',
          { username, password, recaptchaValue },
          { withCredentials: true }
        )
        .then((response) => {
          console.log('Server response is: ', response);
          if (response.status) {
            window.alert('Basariyla giris yaptiniz!');
            Cookies.set('admToken', response.data.authToken, {
              expires: 1 / 24,
            });
            setTimeout(() => {
              navigate(`/admin/home`);
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
            setErrorMessage('An unknown error occurred.');
          }
        });
    }
  };
  return (
    <div className={styles.layoutContainer}>
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
          <h2 className={styles.formTitle}>
            <span>🔏</span> <span>Admin Login</span>
          </h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formRowInner}>
                <input
                  type='text'
                  name='username'
                  autoComplete='off'
                  className={styles.input}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label className={styles.label} htmlFor='username'>
                  Username
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formRowInner}>
                <input
                  type='password'
                  name='password'
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

            <button className={styles.button} type='submit'>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
