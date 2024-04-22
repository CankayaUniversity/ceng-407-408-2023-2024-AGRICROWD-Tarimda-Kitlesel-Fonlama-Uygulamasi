import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './UserNavBar.module.css';

function UserNavBar() {
  const location = useLocation();

  const handleLogout = () => {
    Cookies.remove('authToken'); // Kullanıcı token'ını sil
    window.location = '/login';
    alert('You have successfully logged out.');
  };

  return (
    <nav className={styles.container}>
      <div className={styles.navLayout}>
        <div className={styles.line}></div>
        <div className={styles.navItems}>
          <button as={Link} to='/user/my-projects' className={styles.navLink}>
            My Projects
          </button>
          <button as={Link} to='/user/panel' className={styles.navLink}>
            Account settings
          </button>
          <button
            as={Link}
            to='/user/change-password'
            className={styles.navLink}
          >
            Change password
          </button>

          <button className={styles.navLink} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default UserNavBar;
