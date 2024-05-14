import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Navbar.module.css';
import Logo from '../Logo/Logo';

const MainNavbar = ({ isAuthenticated, onLogout }) => {
  useEffect(() => {}, [isAuthenticated]);

  return (
    <header className={`${styles.header} ${styles.sticky}`}>
      <nav className={styles.container}>
        <NavLink to='/'>
          <Logo></Logo>
        </NavLink>

        <div id='navbarNav'>
          <ul className={styles.list}>
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to='/projects'>Projects</NavLink>
                </li>
                <li>
                  <NavLink to='/add-project/inform'>Add Project</NavLink>
                </li>
                <li>
                  <NavLink to='/user/home'>Account</NavLink>
                </li>
                <li>
                  <NavLink to='/logout' onClick={onLogout}>
                    Sign Out
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to='/projects'>Projects</NavLink>
                </li>
                <li>
                  <NavLink to='/login'>Login</NavLink>
                </li>

                <li>
                  <NavLink to='/register'>Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default MainNavbar;
