import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './UserNavBar.module.css';

function UserNavBar() {
  const location = useLocation();

  return (
    <nav className={styles.container}>
      <div className={styles.navLayout}>
        <div className={styles.line}></div>
        <div className={styles.navItems}>
          <Link to='/user/panel' className={styles.navLink}>
            Account settings
          </Link>
          <Link to='/user/change-password' className={styles.navLink}>
            Change password
          </Link>
          <Link to='/user/my-projects' className={styles.navLink}>
            My Projects
          </Link>
          <Link to='/user/my-investments' className={styles.navLink}>
            My Investments
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default UserNavBar;
