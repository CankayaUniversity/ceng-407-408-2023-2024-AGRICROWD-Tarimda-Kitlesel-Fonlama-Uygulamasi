// MainNavbar.js
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import './navBar.css';

const MainNavbar = ({ isAuthenticated, onLogout }) => {
  useEffect(() => {
  }, [isAuthenticated]);

  return (
    <nav className='auth-nav'>
      <NavLink to="/" className="logo-link">
        <h1>AgriCROWD</h1>
      </NavLink>
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/add-project">Add Project</NavLink>
            </li>
            <li>
              <NavLink to="/user-panel">User Panel</NavLink>
            </li>
            <li>
              <NavLink to="/logout" onClick={onLogout}>
                Logout
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default MainNavbar;
