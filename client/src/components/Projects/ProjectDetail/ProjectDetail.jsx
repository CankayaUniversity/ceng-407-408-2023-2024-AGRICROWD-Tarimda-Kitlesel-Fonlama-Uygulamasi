import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { ethers } from "../../Contracts/ethers-5.7.esm.min.js";
import {
  abi,
  contractAddress,
} from "../../Contracts/smartContractConstants.js";
import NotFound from "../../NotFound/NotFound.jsx";
import styles from "./ProjectDetails.module.css";
import ProgressBar from "../ProgressBar/ProgressBar.jsx";

const ProjectDetail = () => {
  const { projectNameandId } = useParams();
  const [encodedProjectName, pId] = projectNameandId.split("-pid-");
  const [project, setProject] = useState(null);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [amountFundedETH, setAmountFundedETH] = useState(0);
  const [isFunding, setIsFunding] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [projectOwner, setProjectOwner] = useState(null);
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const navigate = useNavigate();

  // Function to check if the user is logged in
  const isLoggedIn = () => {
    // Check for authentication token in cookies
    const authToken = document.cookie.includes("authToken");
    return !!authToken;
  };

  const fetchPhotoUrl = async (photoId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/photos/${photoId}`
      );
      if (response.data.success) {
        return response.data.url;
      } else {
        console.error("Error fetching photo:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/api/projects/details`,
          { projectId: pId }
        );
        if (response.data.success) {
          const projectData = response.data.project;

          const photoUrls = await Promise.all(
            projectData.basicInfo.projectImages.map((photoId) =>
              fetchPhotoUrl(photoId)
            )
          );
          setPhotoUrls(photoUrls);
          setProject(projectData);
        } else {
          console.error("Error fetching project:", response.data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [pId]);

  useEffect(() => {
    if (project && project.basicInfo) {
      setCurrentImageIndex(project.basicInfo.coverImage);
    }
  }, [project]);

  useEffect(() => {
    const fetchProjectOwnerInfo = async () => {
      if (!project) return;

      try {
        const userResponse = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/api/info/user`,
          { userId: project.userId }
        );
        setProjectOwner(userResponse.data);
      } catch (error) {
        console.error("Error fetching project owner's info:", error);
      }
    };

    fetchProjectOwnerInfo();
  }, [project]);

  useEffect(() => {
    setLoginTime(new Date()); // Kullanıcının giriş zamanını al
  }, []);

  useEffect(() => {
    setCanonicalUrl(window.location.href);
  }, []);

  const updateRemainingTime = useCallback(() => {
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
  }, [loginTime, project]);

  useEffect(() => {
    if (project) {
      const interval = setInterval(updateRemainingTime, 60000);
      updateRemainingTime();
      return () => clearInterval(interval);
    }
  }, [project, updateRemainingTime]);

  const handleInvalidUrl = useCallback(() => {
    if (project && project.basicInfo) {
      const projectNameInUrl = project.basicInfo.projectName
        .replace(/\s+/g, "-")
        .toLowerCase();
      const correctedUrl = `/project/${projectNameInUrl}-pid-${project._id}`;
      navigate(correctedUrl);
    }
  }, [project, navigate]);

  useEffect(() => {
    if (project && project.basicInfo.projectName !== encodedProjectName) {
      handleInvalidUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const returnUrl = window.location.pathname;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
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
      const returnUrl = window.location.pathname;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
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

  const progress = calculateFundingProgress();

  return (
    <div className={styles.projectDetailContainer}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{project.basicInfo.projectName} - AGRICROWD</title>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <nav className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link
          to={`/projects/${project.category.mainCategory.categoryName
            .replace(/\s+/g, "-")
            .toLowerCase()}-cid-${project.category.mainCategory._id}`}
        >
          {project.category.mainCategory.categoryName}
        </Link>
        <Link
          to={`/projects/${project.category.subCategory.subCategoryName
            .replace(/\s+/g, "-")
            .toLowerCase()}-cid-${project.category.subCategory._id}`}
        >
          {project.category.subCategory.subCategoryName}
        </Link>
      </nav>
      <div className={styles.infoContainer}>
        <div className={styles.sliderContainer}>
          <div className={styles.slider}>
            {project.basicInfo.projectImages &&
            project.basicInfo.projectImages.length > 0 ? (
              <div className={styles.mainImageContainer}>
                <img
                  className={styles.mainImage}
                  src={photoUrls[currentImageIndex]}
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

          <div>
            <div className={styles.projectSubInfo}>
              <h3 style={{ marginBottom: "0.5rem" }}>Description</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: project.basicInfo.projectDescription,
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className={styles.projectInfo}>
            <h3>{project.basicInfo.projectName}</h3>

            <div className={styles.tagsContainer}>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <div className={styles.mainTag}>
                  <span style={{ marginRight: "0.4rem" }}>🏷️</span>
                  {project.category.mainCategory.categoryName}
                </div>
                <div className={styles.subTag}>
                  <span style={{ marginRight: "0.4rem" }}>🏷️</span>
                  {project.category.subCategory.subCategoryName}
                </div>
              </div>
              <div className={styles.tag}>
                <span>📍</span>{" "}
                <span style={{ fontWeight: "500" }}>Country:</span>{" "}
                {project.basicInfo.country}
              </div>
              {project.basicInfo.location && (
                <div className={styles.tag}>
                  <span>🌐</span> Location: Lat:{" "}
                  {project.basicInfo.location.lat}, Lng:{" "}
                  {project.basicInfo.location.lng}
                </div>
              )}
            </div>
            <div className={styles.infoContainer}>
              <p>
                <span>💌</span>{" "}
                <span style={{ fontWeight: "500" }}>Target Amount:</span>{" "}
                {project.basicInfo.targetAmount} ETH
              </p>
            </div>
            <div className={styles.infoContainer}>
              <p>
                <span style={{ fontWeight: "500" }}>Reward Percentage:</span>{" "}
                {project.basicInfo.rewardPercentage} %
              </p>
            </div>
            <p className={styles.remainingTime}>
              <div>
                <span style={{ marginRight: "0.5rem" }}>⏱️</span>
                <span style={{ fontWeight: "500" }}>
                  Investment Remaining Time:
                </span>
              </div>
              {remainingTime && (
                <span>
                  {`${remainingTime.days} days, ${remainingTime.hours} hours, ${remainingTime.minutes} minutes left`}
                </span>
              )}
            </p>

            {/* Funded amount */}
            <div className={styles.fundedAmount}>
              <span style={{ fontWeight: "500" }}>
                Amount Funded: {amountFundedETH} ETH
              </span>
              <p style={{ marginTop: "0.5rem", color: "green" }}>
                (Our platform takes %5 of the funds as a commission. But we
                don't take any commission from the donations.)
              </p>
              {progress >= 100 && (
                <p style={{ marginTop: "0.5rem", color: "red" }}>
                  This project has reached its funding goal. You can no longer
                  send funds to this project, but you can still make donations.
                </p>
              )}
            </div>

            {/* Progress bar */}
            <ProgressBar progress={progress} />

            <div style={{ display: "flex", gap: "1rem", margin: "0 auto" }}>
              {/* Disable the "Fund" button if the project is fully funded */}
              {progress < 100 && (
                <button
                  onClick={fundProject}
                  className={styles.button}
                  style={{
                    backgroundColor: "#37b24d",
                  }}
                  disabled={isFunding}
                >
                  {isFunding ? "Funding..." : "Fund"}
                </button>
              )}
              <button
                onClick={donateProject}
                className={styles.button}
                style={{
                  backgroundColor: "#fff",
                  color: "#333",
                }}
                disabled={isDonating}
              >
                {isDonating ? "Donating..." : "Donate"}
              </button>
            </div>
          </div>
          <div className={styles.projectSubInfo}>
            {projectOwner && (
              <>
                <h3 style={{ marginBottom: "0.5rem", fontWeight: "700" }}>
                  Project Owner
                </h3>
                <p style={{ marginBottom: ".5rem", fontWeight: "600" }}>
                  {projectOwner.data.name} {projectOwner.data.surname}
                </p>
                <p style={{ marginBottom: ".5rem" }}>
                  <span style={{ fontWeight: "600" }}>Phone:</span>{" "}
                  {projectOwner.data.phone}
                </p>
                <p>
                  <span style={{ fontWeight: "600" }}>Email:</span>{" "}
                  {projectOwner.data.email}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
