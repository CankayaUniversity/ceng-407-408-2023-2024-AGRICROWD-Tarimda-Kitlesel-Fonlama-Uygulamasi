import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserNavBar.module.css';

function UserNavBar() {
  const [dropdownStates, setDropdownStates] = useState({
    accountSettings: false,
    myProjects: false,
  });

  const toggleDropdown = (dropdownName) => {
    setDropdownStates({
      ...dropdownStates,
      [dropdownName]: !dropdownStates[dropdownName],
    });
  };

  return (
    <nav className={styles.container}>
      <div className={styles.navLayout}>
        <div className={styles.line}></div>
        <div className={styles.navItems}>
          <Link to='/user/home' className={styles.navLink}>
            Home
          </Link>
          <div className={`${styles.dropdown} ${dropdownStates.accountSettings ? styles.dropdownOpen : ''}`}>
            <div className={styles.dropdownButton} onClick={() => toggleDropdown('accountSettings')}>
              <span className={styles.navLink}>
                Account Settings
                <svg className={`${styles.arrowIcon} ${dropdownStates.accountSettings ? styles.rotate180 : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3L8 13L16 3H0Z" fill="#339af0" />
                </svg>
              </span>
            </div>
            {dropdownStates.accountSettings && (
              <div className={styles.dropdownContent}>
                <ul className={styles.dropdownList}>
                  <li className={styles.dropdownItem}>
                    <Link to='/user/account-settings' className={styles.dropdownLink}>
                      Personal Information
                    </Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link to='/user/change-password' className={styles.dropdownLink}>
                      Change Password
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className={`${styles.dropdown} ${dropdownStates.myProjects ? styles.dropdownOpen : ''}`}>
            <div className={styles.dropdownButton} onClick={() => toggleDropdown('myProjects')}>
              <span className={styles.navLink}>
                My Projects
                <svg className={`${styles.arrowIcon} ${dropdownStates.myProjects ? styles.rotate180 : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3L8 13L16 3H0Z" fill="#339af0" />
                </svg>
              </span>
            </div>
            {dropdownStates.myProjects && (
              <div className={styles.dropdownContent}>
                <ul className={styles.dropdownList}>
                  <li className={styles.dropdownItem}>
                    <Link to='/user/my-projects' className={styles.dropdownLink}>
                      Active Projects
                    </Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link to='/user/my-projects/inactive' className={styles.dropdownLink}>
                      Inactive Projects
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <Link to='/user/my-investments' className={styles.navLink}>
            My Investments
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default UserNavBar;
