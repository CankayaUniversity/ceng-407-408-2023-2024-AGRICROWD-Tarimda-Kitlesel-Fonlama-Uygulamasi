import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "../../../Contracts/ethers-5.7.esm.min.js"; // Import ethers.js for interacting with the smart contract
import {
  abi,
  contractAddress,
} from "../../../Contracts/smartContractConstants.js"; // Import the smart contract ABI and address
import { Helmet } from "react-helmet-async";
import styles from "./PendingProjects.module.css";

const RenderProjectData = ({ projectData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projectImages, setProjectImages] = useState([]);
  useEffect(() => {
    const fetchProjectImages = async () => {
      try {
        const photoData = await Promise.all(
          projectData.basicInfo.projectImages.map(async (imageId) => {
            const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/photos/${imageId}`);
            return response.data.photo.url;
          })
        );
        setProjectImages(photoData);
      } catch (error) {
        console.error("Error fetching project images:", error);
      }
    };

    fetchProjectImages();
  }, [projectData.basicInfo.projectImages]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? projectImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      <div>
        <h3 className={styles.projectTitle}>
          {projectData.basicInfo.projectName}
        </h3>
        <div className={styles.projectContent}>
          <div>
            <h4>Project Description</h4>
            <div
              dangerouslySetInnerHTML={{
                __html: projectData.basicInfo.projectDescription,
              }}
            />
          </div>
          <div>
            <h4>Category</h4> {projectData.category.mainCategory.categoryName}
          </div>
          <div>
            <h4>Subcategory</h4>{" "}
            {projectData.category.subCategory.subCategoryName}
          </div>
          <div>
            <h4>Country</h4> {projectData.basicInfo.country}
          </div>
          <div>
            <h4>Target Amount</h4> {projectData.basicInfo.targetAmount}
          </div>
          <div>
            <h4>Campaign Duration</h4> {projectData.basicInfo.campaignDuration}{" "}
            days
          </div>
        </div>
        {projectData.basicInfo.projectImages &&
          projectData.basicInfo.projectImages.length > 0 ? (
          <div className={styles.projectImagesContainer}>
            <h4>Project Photos</h4>
            <div>
              <img
                className={styles.projectImage}
                src={projectImages[currentImageIndex]}
                alt={`Project ${currentImageIndex}`}
              />
              <div className={styles.sliderControls}>
                <button className={styles.sliderButton} onClick={prevImage}>
                  ‹
                </button>
                <button className={styles.sliderButton} onClick={nextImage}>
                  ›
                </button>
              </div>
            </div>
          </div>
        ) : (
          <li className="list-group-item">
            No photos available for this project!
          </li>
        )}
      </div>
    </div>
  );
};

const PendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");


  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/admin/projects/pending`
      );
      const projectsWithUserDetails = await Promise.all(
        response.data.pendingProjects.map(async (project) => {
          const userResponse = await axios.post(
            `${process.env.REACT_APP_BASE_API_URL}/api/info/user`,
            { userId: project.userId }
          );
          const userDetails = userResponse.data;
          return { ...project, userDetails };
        })
      );
      setProjects(projectsWithUserDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedbackMessage("");
    }, 15000);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const handleApproveProject = async (projectId, fundingGoalETH) => {
    try {
      // Connect to Ethereum blockchain and interact with the smart contract
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      //const signer = provider.getSigner();
      //const contract = new ethers.Contract(contractAddress, abi, signer);

      // Call createProject function in the smart contract
      //const transactionResponse = await contract.createProject(
      //  projectId, // MongoDB ObjectId as a parameter
      //  ethers.utils.parseEther(fundingGoalETH.toString())
      //);

      // Wait for the transaction to be mined
      //await transactionResponse.wait();

      // Once the transaction is successful, proceed with backend approval
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API_URL}/api/admin/projects/approve`,
        {
          projectId,
        }
      );

      if (response.data.success) {
        setSelectedProjectId(null);
        setFeedbackMessage(response.data.message); // success message !
        fetchProjects();
      } else {
        setFeedbackMessage("Error approving project. Please try again later.");
      }
    } catch (error) {
      console.error("Error approving project:", error);
      setFeedbackMessage("Error approving project. Please try again later.");
    }
  };

  const handleRejectProject = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API_URL}/api/admin/projects/reject`,
        {
          projectId: selectedProjectId,
          rejectionReason,
        }
      );

      if (response.data.success) {
        setRejectionReason("");
        setSelectedProjectId(null);
        setFeedbackMessage(response.data.message);
        fetchProjects();
      } else {
        setFeedbackMessage("Error rejecting project. Please try again later.");
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
      setFeedbackMessage("Error rejecting project. Please try again later.");
    }
  };

  const renderUserDetails = (userDetails) => {
    return (
      <div className={styles.userDetails}>
        <h4>User Details </h4>
        <div className={styles.userDetailsContent}>
          <div>
            <h5 className={styles.subHeading}>Name:</h5> {userDetails.data.name}
          </div>
          <div>
            <h5 className={styles.subHeading}>Email:</h5>{" "}
            {userDetails.data.email}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageLayout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Pending Projects - AGRICROWD</title>
        <link
          rel="canonical"
          href="http://localhost:3000/admin/pending-projects"
        />
      </Helmet>
      <h2 className={styles.title}>Manage Pending Projects</h2>
      {feedbackMessage && (
        <div className={styles.message}>{feedbackMessage}</div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <div className={styles.noProjectsMessage}>
          There are currently no projects awaiting approval ❌
        </div>
      ) : (
        <div className={styles.gridContainer}>
          {projects.map((project) => (
            <div key={project._id} className={styles.cardContainer}>
              <div className="card">
                <div className="card-body">
                  <RenderProjectData projectData={project} />

                  <div>
                    {renderUserDetails(project.userDetails)}
                    {selectedProjectId !== project._id && (
                      <div className={styles.btnsContainer}>
                        <button
                          className={styles.button}
                          onClick={() =>
                            handleApproveProject(
                              project._id,
                              project.basicInfo.targetAmount
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className={styles.button}
                          onClick={() => setSelectedProjectId(project._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {selectedProjectId === project._id && (
                      <div className={styles.btnsContainer}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Rejection Reason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />

                        <button
                          className={styles.button}
                          onClick={() => setSelectedProjectId(null)}
                          style={{ marginRight: "0.4rem" }}
                        >
                          Back
                        </button>
                        <button
                          className={styles.button}
                          onClick={handleRejectProject}
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingProjects;
