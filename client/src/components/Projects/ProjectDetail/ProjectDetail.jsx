import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "../../Contracts/ethers-5.7.esm.min.js";
import {
  abi,
  contractAddress,
} from "../../Contracts/smartContractConstants.js";
import NotFound from "../../NotFound/NotFound.jsx";
import styles from "./ProjectDetails.module.css";

const ProjectDetail = () => {
  const { projectNameandId } = useParams();
  const [encodedProjectName, pId] = projectNameandId.split("-pid-");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [amountFundedETH, setAmountFundedETH] = useState(0);
  const [isFunding, setIsFunding] = useState(false);
  const [isDonating, setIsDonating] = useState(false);

  // Function to check if the user is logged in
  const isLoggedIn = () => {
    // Check for authentication token in local storage or cookies
    const authToken =
      localStorage.getItem("authToken") ||
      document.cookie.includes("authToken");
    return !!authToken;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3001/api/projects/details`,
          { projectId: pId }
        );
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [pId]);

  useEffect(() => {
    setLoginTime(new Date()); // Kullanıcının giriş zamanını al
  }, []);

  useEffect(() => {
    if (project) {
      const interval = setInterval(updateRemainingTime, 60000);
      updateRemainingTime();
      return () => clearInterval(interval);
    }
  }, [project]);

  const updateRemainingTime = () => {
    if (!loginTime) return; // Giriş zamanı henüz ayarlanmadıysa fonksiyondan çık

    const campaignDuration = project.basicInfo.campaignDuration;
    const approvalDate = new Date(project.approvalDate);
    const currentDate = new Date();

    const timeDifference = Math.max((currentDate - approvalDate) / 1000, 0);
    const remainingTimeInSeconds =
      campaignDuration * 24 * 60 * 60 - timeDifference;

    // Girişten geçen süreyi hesapla
    const elapsedTimeInSeconds = Math.max((currentDate - loginTime) / 1000, 0);
    const remainingTimeAdjusted = remainingTimeInSeconds - elapsedTimeInSeconds;

    const days = Math.floor(remainingTimeAdjusted / (24 * 60 * 60));
    const hours = Math.floor(
      (remainingTimeAdjusted % (24 * 60 * 60)) / (60 * 60)
    );
    const minutes = Math.floor((remainingTimeAdjusted % (60 * 60)) / 60);

    setRemainingTime({ days, hours, minutes });
  };

  const handleInvalidUrl = () => {
    const correctedUrl = `/project/${encodeURIComponent(
      project.basicInfo.projectName
    )}-pid-${pId}`;
    navigate(correctedUrl);
  };

  useEffect(() => {
    if (project && project.basicInfo.projectName != encodedProjectName) {
      handleInvalidUrl();
    }
  }, [project]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === project.basicInfo.projectImages.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? project.basicInfo.projectImages.length - 1
        : prevIndex - 1
    );
  };

  // Fetch the amountFunded value from the smart contract
  useEffect(() => {
    const fetchAmountFunded = async () => {
      if (!project) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const projectDetails = await contract.getProjectDetails(pId);
        setAmountFundedETH(ethers.utils.formatEther(projectDetails[4]));
      } catch (error) {
        console.error("Error fetching amount funded:", error);
      }
    };

    fetchAmountFunded();
  }, [project, pId]);

  const fundProject = async () => {
    // Check if the user is logged in
    if (!isLoggedIn()) {
      alert("Please log in to fund the project.");
      return;
    }

    const ethAmount = prompt("Enter the amount in ETH you want to fund:");
    if (ethAmount) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        setIsFunding(true);
        const transactionResponse = await contract.fundProject(pId, {
          value: ethers.utils.parseEther(ethAmount),
        });
        await listenForTransactionMine(transactionResponse, provider);
        alert("Successfully funded the project!");
        setIsFunding(false);
      } catch (error) {
        console.error("Error funding the project:", error);
        alert("An error occurred while funding the project.");
        setIsFunding(false);
      }
    }
  };

  const donateProject = async () => {
    // Check if the user is logged in
    if (!isLoggedIn()) {
      alert("Please log in to donate to the project.");
      return;
    }

    const ethAmount = prompt("Enter the amount in ETH you want to donate:");
    if (ethAmount) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        setIsDonating(true);
        const transactionResponse = await contract.donateProject(pId, {
          value: ethers.utils.parseEther(ethAmount),
        });
        await listenForTransactionMine(transactionResponse, provider);
        alert("Successfully donated to the project!");
        setIsDonating(false);
      } catch (error) {
        console.error("Error donating to the project:", error);
        alert("An error occurred while donating to the project.");
        setIsDonating(false);
      }
    }
  };

  const listenForTransactionMine = async (transactionResponse, provider) => {
    try {
      const receipt = await transactionResponse.wait();
      if (receipt.status === 1) {
        console.log("Transaction successful!");
      } else {
        console.error("Transaction failed!");
      }
    } catch (error) {
      console.error("Error during transaction mining:", error);
    }
  };

  const calculateFundingProgress = () => {
    const targetAmount = project.basicInfo.targetAmount;
    return (amountFundedETH / targetAmount) * 100;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className={styles.projectDetailContainer}>
      <div className={styles.sliderContainer}>
        <div className={styles.slider}>
          {project.basicInfo.projectImages &&
          project.basicInfo.projectImages.length > 0 ? (
            <div className={styles.mainImageContainer}>
              <img
                className={styles.mainImage}
                src={`http://localhost:3001/api/photos/${project.basicInfo.projectImages[currentImageIndex]._id}`}
                alt={`Project ${currentImageIndex}`}
              />
              <button className={styles.prevButton} onClick={prevImage}>
                Previous
              </button>
              <button className={styles.nextButton} onClick={nextImage}>
                Next
              </button>
            </div>
          ) : (
            <div>No photos available for this project!</div>
          )}
        </div>
      </div>

      <div className={styles.projectInfo}>
        <h3>{project.basicInfo.projectName}</h3>
        <p>{project.basicInfo.projectDescription}</p>
        <div className={styles.tagsContainer}>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <div className={styles.mainTag}>
              <span>🏷️</span>
              {project.basicInfo.category}
            </div>
            <div className={styles.subTag}>
              <span>🏷️</span>
              {project.basicInfo.subCategory}
            </div>
          </div>
          <div className={styles.tag}>
            <span>📍</span> Country: {project.basicInfo.country}
          </div>
        </div>
        <div className={styles.infoContainer}>
          <p>
            <span>💌</span> Target Amount: {project.basicInfo.targetAmount} ETH
            (1 ETH = $5000)
          </p>
          {/* <p>
            <span>⏳</span> Campaign Duration:{' '}
            {project.basicInfo.campaignDuration} days
          </p> */}
        </div>
        <p className={styles.remainingTime}>
          <span>⏱️</span> Investment Remaining Time:{" "}
          {remainingTime &&
            `${remainingTime.days} days, ${remainingTime.hours} hours, ${remainingTime.minutes} minutes left`}
        </p>
      </div>
      {/* Progress bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-bar-filled"
            style={{ width: `${calculateFundingProgress()}%` }}
          >
            {calculateFundingProgress().toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="project-actions">
        {/* Disable the "Fund" button if the project is fully funded */}
        <button
          onClick={fundProject}
          disabled={isFunding || calculateFundingProgress() >= 100}
        >
          {isFunding ? "Funding..." : "Fund"}
        </button>
        <button onClick={donateProject} disabled={isDonating}>
          {isDonating ? "Donating..." : "Donate"}
        </button>
      </div>
    </div>
  );
};

export default ProjectDetail;
