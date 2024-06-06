import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ethers } from "../../Contracts/ethers-5.7.esm.min.js";
import {
  abi,
  contractAddress,
} from "../../Contracts/smartContractConstants.js";
import styles from "./MyInvestments.module.css";

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      // Connect to Ethereum blockchain
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Get investor's address from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const investor = accounts[0]; // Assuming only one account is connected

        // Call smart contract function to fetch investments
        const investmentDetails = await contract.getInvestmentsByAddress(
          investor
        );

        // Format the investment details
        const formattedInvestments = investmentDetails[0].map(
          (objectId, index) => ({
            objectId,
            fundingAmount: ethers.utils.formatEther(
              investmentDetails[1][index]
            ),
            rewardAmount: ethers.utils.formatEther(investmentDetails[2][index]),
            projectName: investmentDetails[3][index], // Added project name
          })
        );

        setInvestments(formattedInvestments);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Investments - AGRICROWD</title>
        <link
          rel="canonical"
          href="http://localhost:3000/user/my-investments"
        />
      </Helmet>
      <h1>My Investments</h1>
      <p>Here you can manage your investments, and more.</p>
      <div className={styles.investmentsContainer}>
        {investments.map((investment, index) => (
          <div key={index} className={styles.investmentItem}>
            <p className={styles.projectName}>{investment.projectName}</p>{" "}
            {/* Updated to display project name */}
            <p>Funding Amount: {investment.fundingAmount} ETH</p>
            <p>Your Reward: {investment.rewardAmount} ETH</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyInvestments;
