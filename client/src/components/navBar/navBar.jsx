import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom'; 

import './navBar.css';

const MainNavbar = ({ isAuthenticated, onLogout }) => {
  useEffect(() => {
  }, [isAuthenticated]);

  return (
    <nav className='auth-nav navbar navbar-expand-lg navbar-light bg-light'>
      <NavLink to="/" className="navbar-brand">
        AgriCROWD
      </NavLink>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink to="/add-project" className="nav-link" activeClassName="active">Add Project</NavLink> 
              </li>
              <li className="nav-item">
                <NavLink to="/user/panel" className="nav-link" activeClassName="active">User Panel</NavLink> 
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link" activeClassName="active">Login</NavLink> 
              </li>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link" activeClassName="active">Register</NavLink> 
              </li>
            </>
          )}
        </ul>
        {isAuthenticated && (
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/logout" className="nav-link" activeClassName="active" onClick={onLogout}> 
                Logout
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;
