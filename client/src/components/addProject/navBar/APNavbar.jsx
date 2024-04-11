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
        // const rewardCompleted = localStorage.getItem("isRewardCompleted") === "true";

        if (informCompleted !== null) setIsInformCompleted(informCompleted);
        if (basicsCompleted !== null) setIsBasicsCompleted(basicsCompleted);
        // if (rewardCompleted !== null) setIsRewardCompleted(rewardCompleted); 

        console.log("Inform: ", isInformCompleted);
        console.log("BasicInfo: ", isBasicsCompleted);
        console.log("Reward: ", isRewardCompleted);

        setIsSubmitClickable(isInformCompleted && isBasicsCompleted && isRewardCompleted);
    }, [location.pathname, isInformCompleted, isBasicsCompleted, isRewardCompleted]);

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <ul className='navbar-nav mr-auto'>
                <NavLink
                    to="/add-project/inform"
                    className={`nav-link ${location.pathname === '/add-project/inform' ? 'active' : ''} ${!isInformCompleted ? '' : 'disabled'}`}
                >
                    {isInformCompleted ? 'Inform (Completed)' : 'Inform (Not Completed)'}
                </NavLink>
                <li className='nav-item'>
                    <NavLink to="/add-project/basics" className={`nav-link ${location.pathname === '/add-project/basics' ? 'active' : ''} ${isInformCompleted ? '' : 'disabled'}`} >Add Basic</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/reward" className={`nav-link ${location.pathname === '/add-project/reward' ? 'active' : ''} ${isBasicsCompleted ? '' : 'disabled'}`} >Add Reward</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink to="/add-project/submit" className={`nav-link ${location.pathname === '/add-project/submit' ? 'active' : ''} ${isSubmitClickable ? '' : 'disabled'}`} >Submit for Approval</NavLink>
                </li>
            </ul>
        </nav>
    );

};

export default NavBar;
