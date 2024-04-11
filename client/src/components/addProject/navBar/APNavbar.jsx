import React from "react";
import { NavLink } from "react-router-dom";
import "./navBar.css";

const NavBar = ({ isInformCompleted }) => { 
    const isBasicsCompleted = false; 
    const isRewardCompleted = false; 
    const isSubmitClickable = isInformCompleted && isBasicsCompleted && isRewardCompleted;

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <ul className='navbar-nav mr-auto'>
                <li className='nav-item'>
                    <NavLink to="/add-project/inform" className={`nav-link ${!isInformCompleted ? 'active' : ''}`} activeClassName="active">Inform</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/basics" className={`nav-link ${isInformCompleted ? 'active' : 'disabled'}`} activeClassName="active">Add Basic</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/reward" className={`nav-link ${isBasicsCompleted ? 'active' : 'disabled'}`} activeClassName="active">Add Reward</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/submit" className={`nav-link ${isSubmitClickable ? '' : 'disabled'}`} activeClassName="active">Submit for Approval</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
