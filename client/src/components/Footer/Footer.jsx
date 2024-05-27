import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.borderDiv}></div>
      <div className={styles.textContainer}>
        <p className={styles.text}>
          Yukarıyurtçu Mahallesi Mimar Sinan Cad. No:4, 06790 Etimesgut / Ankara
        </p>
        <p className={styles.text}>
          <span className={styles.fontBold}>Phone:</span> +90 312 233 13 33
        </p>
        <p className={styles.text}>
          <span className={styles.fontBold}>Fax:</span> +90 312 233 10 26
        </p>
        <p className={styles.text}>
          <span className={styles.fontBold}>E-mail:</span> ceng@cankaya.edu.tr
        </p>
        <p className={styles.text}>&copy; 2023-2024 AGRICROWD</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className={styles.icons}>
          <img src='/images/logo-facebook.svg' width={24} alt='Facebook'></img>
          <img
            src='/images/logo-instagram.svg'
            width={24}
            alt='Instagram'
          ></img>
          <img src='/images/logo-twitter.svg' width={24} alt='Twitter'></img>
          <img src='/images/logo-youtube.svg' width={24} alt='YouTube'></img>
        </div>
        <img
          className={styles.logo}
          src='/images/cankaya-uni-logo.png'
          width={120}
          alt='Çankaya University'
        ></img>
      </div>
    </div>
  );
};

export default Footer;
