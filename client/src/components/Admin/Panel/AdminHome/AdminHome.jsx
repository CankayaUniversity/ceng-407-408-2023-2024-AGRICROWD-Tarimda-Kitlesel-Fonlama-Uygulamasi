import React, { useEffect, useState } from 'react';
import styles from './AdminHome.module.css';
import { ethers } from '../../../Contracts/ethers-5.7.esm.min.js'; // Import ethers.js
import {
  abi,
  contractAddress,
} from '../../../Contracts/smartContractConstants.js'; // Import ABI and contract address
import { Helmet } from 'react-helmet-async';

function AdminHome() {
  // Define a state variable to store the total commission amount
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    // Fetch the total commission amount from the smart contract when the component mounts
    const fetchTotalCommission = async () => {
      try {
        // Create a provider and signer for ethers.js
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create a contract instance
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Fetch the total commission amount from the contract
        const totalCommissionFromContract =
          await contract.getTotalCommissionAmount();

        // Convert the commission amount from BigNumber to a readable number
        const totalCommissionInEther = ethers.utils.formatEther(
          totalCommissionFromContract
        );

        // Set the total commission amount in state
        setTotalCommission(totalCommissionInEther);
      } catch (error) {
        console.error('Error fetching total commission amount:', error);
      }
    };

    fetchTotalCommission();
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Admin Home - AGRICROWD</title>
        <link rel='canonical' href='http://localhost:3000/admin/home' />
      </Helmet>
      <h1>Welcome to Admin Panel!</h1>
      <div>
        <p style={{ marginBottom: '0.5rem' }}>
          You can manage your users and projects in the system using the
          navigation bar.
        </p>
        {/* Display the total commission amount */}
        <h2 style={{ textAlign: 'center' }}>
          Total Commission Amount: {totalCommission} ETH
        </h2>
      </div>
    </div>
  );
}

export default AdminHome;
