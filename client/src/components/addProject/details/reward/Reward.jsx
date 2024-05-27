import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import styles from './Reward.module.css';

const Reward = () => {
  const [percentage, setPercentage] = useState('');
  const [isRewardCompleted, setIsRewardCompleted] = useState(
    localStorage.getItem('isRewardCompleted') === 'true'
  );
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate that the percentage is a positive number
    if (percentage && parseFloat(percentage) > 0) {
      // Save the percentage value to local storage
      localStorage.setItem('percentage', percentage);

      // Set isRewardCompleted to true and save it to local storage
      setIsRewardCompleted(true);
      localStorage.setItem('isRewardCompleted', 'true');
      navigate('/add-project/submit');
      console.log('Reward info submitted successfully!');
    } else {
      alert('Please enter a valid percentage.');
    }
  };

  const handlePercentageChange = (event) => {
    setPercentage(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Reward Mechanisim of Your Project - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/add-project/reward" />
      </Helmet>
      <h2 className={styles.formTitle}>Reward</h2>
      <p className={styles.content}>
        Please be informed that all future investments made through our platform
        will incur a 5% commission fee. This fee is automatically applied to
        each investment and is deducted from the total amount invested. Thank
        you for your understanding and continued support.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div>
          <label htmlFor='percentage' style={{ marginRight: '1.5rem' }}>
            How much percentage does the investee want to take?
          </label>
          <input
            type='number'
            id='percentage'
            name='percentage'
            min='0'
            value={percentage}
            onChange={handlePercentageChange}
            placeholder='Enter percentage'
            required
          />
        </div>
        <button className={styles.button} type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Reward;
