import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "../../../Contracts/ethers-5.7.esm.min.js"; // Import ethers.js for interacting with the smart contract
import {
  abi,
  contractAddress,
} from "../../../Contracts/smartContractConstants.js"; // Import the smart contract ABI and address

import styles from "./PendingProjects.module.css";

const PendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/admin/projects/pending"
      );
      const projectsWithUserDetails = await Promise.all(
        response.data.map(async (project) => {
          const userResponse = await axios.post(
            "http://localhost:3001/api/info/user",
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Call createProject function in the smart contract
      const transactionResponse = await contract.createProject(
        projectId, // MongoDB ObjectId as a parameter
        ethers.utils.parseEther(fundingGoalETH.toString())
      );

      // Wait for the transaction to be mined
      await transactionResponse.wait();

      // Once the transaction is successful, proceed with backend approval
      const response = await axios.put(
        "http://localhost:3001/api/admin/projects/approve",
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
        "http://localhost:3001/api/admin/projects/reject",
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

  const renderProjectData = (projectData) => {
    return (
      <div>
        <div>
          <h3 className={styles.projectTitle}>{projectData.projectName}</h3>

          <div className={styles.projectContent}>
            <div>
              <h4>Project Description</h4>
              {projectData.projectDescription}
            </div>
            <div>
              <h4>Category</h4> {projectData.category}
            </div>
            <div>
              <h4>Subcategory</h4> {projectData.subCategory}
            </div>
            <div>
              <h4>Country</h4> {projectData.country}
            </div>
            <div>
              <h4>Target Amount</h4> {projectData.targetAmount}
            </div>
            <div>
              <h4>Campaign Duration</h4> {projectData.campaignDuration} days
            </div>
          </div>
          {projectData.projectImages && projectData.projectImages.length > 0 ? (
            <div className={styles.projectImagesContainer}>
              <h4>Project Photos</h4>
              <div>
                {projectData.projectImages.map((photo, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3001/api/photos/${photo._id}`}
                    alt={`Project ${index}`}
                    className={styles.projectImage}
                  />
                ))}
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

  const renderUserDetails = (userDetails) => {
    return (
      <div className={styles.userDetails}>
        <h4>User Details </h4>
        <div className={styles.userDetailsContent}>
          <div>
            <h5 className={styles.subHeading}>Name:</h5> {userDetails.data.name}
          </div>
          <div>
            <h5 className={styles.subHeading}>Email:</h5> {userDetails.data.email}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageLayout}>
      <h2 className={styles.title}>*manage pending projects</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.gridContainer}>
          {projects
            .filter((project) => project.status === "pending")
            .map((project) => (
              <div key={project._id} className={styles.cardContainer}>
                <div className="card">
                  <div className="card-body">
                    {renderProjectData(project.basicInfo)}

                    <div>
                      {renderUserDetails(project.userDetails)}

                      {feedbackMessage && (
                        <div className={styles.message}>{feedbackMessage}</div>
                      )}

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
