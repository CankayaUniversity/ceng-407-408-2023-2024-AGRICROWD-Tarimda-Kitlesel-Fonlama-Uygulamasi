import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import styles from './AdminNavbar.module.css';
import Logo from '../../../Logo/Logo';

function AdminNavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('admToken');
    navigate('/');
    alert('You have successfully logged out.');
  };

  return (
    <header className={`${styles.header} ${styles.sticky}`}>
      <nav className={styles.container}>
        <NavLink to='/admin/home'>
          <Logo headingText='Admin Panel'></Logo>
        </NavLink>

        <div id='admin-navbar-nav'>
          <ul className={styles.list}>
            <NavLink
              to='/admin/home'
              className={location.pathname === '/admin/home' ? 'active' : ''}
            >
              Home
            </NavLink>
            <NavLink
              to='/admin/change-password'
              className={
                location.pathname === '/admin/change-password' ? 'active' : ''
              }
            >
              Change Password
            </NavLink>
            <NavLink
              to='/admin/categories'
              className={
                location.pathname === '/admin/categories' ? 'active' : ''
              }
            >
              Categories
            </NavLink>
            <NavLink
              to='/admin/pending-projects'
              className={
                location.pathname === '/admin/pending-projects' ? 'active' : ''
              }
            >
              Pending Projects
            </NavLink>
            <button onClick={handleLogout}>Logout</button>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default AdminNavBar;
