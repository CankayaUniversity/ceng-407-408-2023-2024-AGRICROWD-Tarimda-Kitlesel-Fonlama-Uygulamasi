import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const styles = {
  progressBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  tab: {
    borderBottom: '1px solid #333',
    paddingBottom: '4px',
  },
};

const NavBar = () => {
  const [isInformCompleted, setIsInformCompleted] = useState(false);
  const [isBasicsCompleted, setIsBasicsCompleted] = useState(false);
  const [isRewardCompleted, setIsRewardCompleted] = useState(true); // Adil reward bolumunu tasaraylana kadar otomatik true
  const [isSubmitClickable, setIsSubmitClickable] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const informCompleted =
      localStorage.getItem('isInformCompleted') === 'true';
    const basicsCompleted =
      localStorage.getItem('isBasicsCompleted') === 'true';
    // const rewardCompleted = localStorage.getItem("isRewardCompleted") === "true";

    if (informCompleted !== null) setIsInformCompleted(informCompleted);
    if (basicsCompleted !== null) setIsBasicsCompleted(basicsCompleted);
    // if (rewardCompleted !== null) setIsRewardCompleted(rewardCompleted);

    console.log('Inform: ', isInformCompleted);
    console.log('BasicInfo: ', isBasicsCompleted);
    console.log('Reward: ', isRewardCompleted);

    setIsSubmitClickable(
      isInformCompleted && isBasicsCompleted && isRewardCompleted
    );
  }, [
    location.pathname,
    isInformCompleted,
    isBasicsCompleted,
    isRewardCompleted,
  ]);

  return (
    <nav style={styles.progressBar}>
      <NavLink
        to='/add-project/inform'
        style={styles.tab}
        // className={`tab ${
        //   location.pathname === '/add-project/inform' ? 'active' : ''
        // } ${!isInformCompleted ? '' : 'disabled'}`}
      >
        {isInformCompleted ? 'Inform (Completed)' : 'Inform (Not Completed)'}
      </NavLink>

      <NavLink
        to='/add-project/basics'
        style={styles.tab}
        className={`tab ${
          location.pathname === '/add-project/basics' ? 'active' : ''
        } ${isInformCompleted ? '' : 'disabled'}`}
      >
        Add Basic
      </NavLink>

      <NavLink
        to='/add-project/reward'
        style={styles.tab}
        className={`tab ${
          location.pathname === '/add-project/reward' ? 'active' : ''
        } ${isBasicsCompleted ? '' : 'disabled'}`}
      >
        Add Reward
      </NavLink>

      <NavLink
        to='/add-project/submit'
        style={styles.tab}
        className={`tab ${
          location.pathname === '/add-project/submit' ? 'active' : ''
        } ${isSubmitClickable ? '' : 'disabled'}`}
      >
        Submit for Approval
      </NavLink>
    </nav>
  );
};

export default NavBar;
