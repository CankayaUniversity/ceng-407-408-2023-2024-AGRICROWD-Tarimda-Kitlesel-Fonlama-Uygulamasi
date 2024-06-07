import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Web3 from 'web3';

import styles from './Reward.module.css';

const Reward = () => {
  const [percentage, setPercentage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isRewardCompleted, setIsRewardCompleted] = useState(
    localStorage.getItem('isRewardCompleted') === 'true'
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isRewardCompleted) {
      navigate("/add-project/submit");
    }
  }, [isRewardCompleted, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (percentage && parseFloat(percentage) > 0) {
      if (Web3.utils.isAddress(walletAddress)) {
        localStorage.setItem('percentage', percentage);
        localStorage.setItem('walletAddress', walletAddress);

        setIsRewardCompleted(true);
        localStorage.setItem('isRewardCompleted', 'true');
        navigate('/add-project/submit');
        console.log('Reward info submitted successfully!');
      } else {
        alert('Please enter a valid wallet address.');
      }
    } else {
      alert('Please enter a valid percentage.');
    }
  };

  const handlePercentageChange = (event) => {
    setPercentage(event.target.value);
  };

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
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
        <div>
          <label htmlFor='walletAddress' style={{ marginRight: '1.5rem' }}>
            Wallet Address for Payments:
          </label>
          <input
            type='text'
            id='walletAddress'
            name='walletAddress'
            value={walletAddress}
            onChange={handleWalletAddressChange}
            placeholder='Enter wallet address'
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
