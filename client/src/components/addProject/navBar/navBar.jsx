import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./navBar.css";

const NavBar = () => {
    const [isInformCompleted, setIsInformCompleted] = useState(false);
    const [isBasicsCompleted, setIsBasicsCompleted] = useState(false);
    const [isRewardCompleted, setIsRewardCompleted] = useState(true); // Adil reward bolumunu tasaraylana kadar otomatik true
    const [isSubmitClickable, setIsSubmitClickable] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const informCompleted = localStorage.getItem("isInformCompleted") === "true";
        const basicsCompleted = localStorage.getItem("isBasicsCompleted") === "true";
        const rewardCompleted = localStorage.getItem("isRewardCompleted") === "true";

        if (informCompleted !== null) setIsInformCompleted(informCompleted);
        if (basicsCompleted !== null) setIsBasicsCompleted(basicsCompleted);
        if (rewardCompleted !== null) setIsRewardCompleted(rewardCompleted); 

        setIsRewardCompleted(true); // otomatik true
        setIsSubmitClickable(isInformCompleted && isBasicsCompleted && isRewardCompleted);
    }, [location.pathname],isSubmitClickable);

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <ul className='navbar-nav mr-auto'>
                <li className='nav-item'>
                    <NavLink to="/add-project/inform" className={`nav-link ${location.pathname === '/add-project/inform' ? 'active' : ''}`} activeClassName="active">Inform</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/basics" className={`nav-link ${location.pathname === '/add-project/basics' ? 'active' : ''} ${isInformCompleted ? '' : 'disabled'}`} activeClassName="active">Add Basic</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/reward" className={`nav-link ${location.pathname === '/add-project/reward' ? 'active' : ''} ${isBasicsCompleted ? '' : 'disabled'}`} activeClassName="active">Add Reward</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/submit" className={`nav-link ${location.pathname === '/add-project/submit' ? 'active' : ''} ${isSubmitClickable ? '' : 'disabled'}`} activeClassName="active">Submit for Approval</NavLink>
                </li>
            </ul>
        </nav>
    );
    
};

export default NavBar;
