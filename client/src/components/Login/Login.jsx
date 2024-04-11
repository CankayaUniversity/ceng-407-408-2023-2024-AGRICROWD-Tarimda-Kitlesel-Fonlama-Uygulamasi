import { React, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import Cookies from 'js-cookie';

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
            window.alert('Basariyla giris yaptiniz!');
            Cookies.set('authToken', response.data.authToken, {
              expires: 1 / 24,
            });
            setTimeout(() => {
              navigate(`/user/panel`);
              window.location.reload();
            }, 250);
          } else {
            window.alert('Server hatasi!');
            resetRecaptcha();
          }
        })
        .catch((err) => {
          resetRecaptcha();
          if (err.response && err.response.data && err.response.data.errors) {
            setErrorMessage(err.response.data.errors[0]);
          } else {
            setErrorMessage('Bilinmeyen bir hata oluştu.');
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
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Login;
