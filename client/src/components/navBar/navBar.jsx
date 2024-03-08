import React from 'react';
import { Link } from 'react-router-dom';

import "./navBar.css"

const Navbar = () => (
  <nav className='auth-nav'>
    <Link to="/" className="logo-link">
      <h1>AgriCROWD</h1>
    </Link>
    <ul>
      <li>
        <Link to="/add-project/001">Add Project</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
