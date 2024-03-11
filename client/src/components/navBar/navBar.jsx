// MainNavbar.js

import React from 'react';
import { Link } from 'react-router-dom';

import './navBar.css';

const MainNavbar = () => {
  const isAuthenticated = !!sessionStorage.getItem('authToken');

  return (
    <nav className='auth-nav'>
      <Link to="/" className="logo-link">
        <h1>AgriCROWD</h1>
      </Link>
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/add-project">Add Project</Link>
            </li>
            <li>
              <Link to="/user-panel">User Panel</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default MainNavbar;
