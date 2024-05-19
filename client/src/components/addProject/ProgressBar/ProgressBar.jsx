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
    borderBottom: '2px solid #333',
    paddingBottom: '4px',
    pointerEvents: 'auto', // default
    color: 'black', // default
  },
  tabDisabled: {
    pointerEvents: 'none',
    color: 'gray',
  },
};

const NavBar = () => {
  const [isInformCompleted, setIsInformCompleted] = useState(false);
  const [isBasicsCompleted, setIsBasicsCompleted] = useState(false);
  const [isRewardCompleted, setIsRewardCompleted] = useState(false);
  const [isSubmitClickable, setIsSubmitClickable] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const informCompleted =
      localStorage.getItem('isInformCompleted') === 'true';
    const basicsCompleted =
      localStorage.getItem('isBasicsCompleted') === 'true';
    const rewardCompleted =
      localStorage.getItem('isRewardCompleted') === 'true';

    setIsInformCompleted(informCompleted);
    setIsBasicsCompleted(basicsCompleted);
    setIsRewardCompleted(rewardCompleted);

    setIsSubmitClickable(informCompleted && basicsCompleted && rewardCompleted);
  }, [location.pathname]);

  return (
    <nav style={styles.progressBar}>
      <NavLink
        to='/add-project/inform'
        style={{
          ...styles.tab,
          ...(isInformCompleted ? {} : styles.tabDisabled),
        }}
        className={isInformCompleted ? '' : 'disabled'}
      >
        {isInformCompleted ? 'Inform (Completed)' : 'Inform (Not Completed)'}
      </NavLink>

      <NavLink
        to='/add-project/basics'
        style={{
          ...styles.tab,
          ...(isInformCompleted ? {} : styles.tabDisabled),
        }}
        className={`tab ${isInformCompleted ? '' : 'disabled'}`}
      >
        Add Basic
      </NavLink>

      <NavLink
        to='/add-project/reward'
        style={{
          ...styles.tab,
          ...(isBasicsCompleted ? {} : styles.tabDisabled),
        }}
        className={`tab ${isBasicsCompleted ? '' : 'disabled'}`}
      >
        Add Reward
      </NavLink>

      <NavLink
        to='/add-project/submit'
        style={{
          ...styles.tab,
          ...(isSubmitClickable ? {} : styles.tabDisabled),
        }}
        className={`tab ${isSubmitClickable ? '' : 'disabled'}`}
      >
        Submit for Approval
      </NavLink>
    </nav>
  );
};

export default NavBar;
