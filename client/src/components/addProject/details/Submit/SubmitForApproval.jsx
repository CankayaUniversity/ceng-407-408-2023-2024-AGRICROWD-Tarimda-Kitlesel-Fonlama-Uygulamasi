import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet-async';

import styles from "./SubmitForm.module.css";

const SubmitForm = () => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState(5);
  const [userId, setUserID] = useState("");
  const [isInformCompleted, setIsInformCompleted] = useState(false);
  const [isBasicsCompleted, setIsBasicsCompleted] = useState(false);
  const [isRewardCompleted, setIsRewardCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authTokenFromCookie = Cookies.get("authToken");
    const fetchUserID = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/api/auth`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authTokenFromCookie}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.data.user) {
          setUserID(response.data.user._id);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    let countdownInterval;

    if (remainingTime > 0) {
      countdownInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(countdownInterval);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [remainingTime]);

  useEffect(() => {
    setIsInformCompleted(localStorage.getItem("isInformCompleted") === "true");
    setIsBasicsCompleted(localStorage.getItem("isBasicsCompleted") === "true");
    setIsRewardCompleted(localStorage.getItem("isRewardCompleted") === "true");
  }, []);

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleApprovalSubmit = async () => {
    try {
      if (isInformCompleted && isBasicsCompleted && isRewardCompleted) {
        const basicInfo = JSON.parse(localStorage.getItem(userId));
        const rewardPercentage = localStorage.getItem('percentage');
        const parcedPercantage = JSON.parse(rewardPercentage);
        basicInfo.rewardPercentage = Number(parcedPercantage);
        const { category, subCategory, ...rest } = basicInfo;
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/api/admin/projects/add-pending`,
          {
            userId,
            basicInfo: rest,
            category: {
              mainCategory: basicInfo.category,
              subCategory: basicInfo.subCategory
            }
          }
        );
        setSubmitMessage(response.data.message);
        setIsCheckboxChecked(false);
        setTimeout(() => {
          setSubmitMessage("");
          navigate("/user/my-projects/inactive");
        }, 5000);
        localStorage.removeItem(userId);
        localStorage.removeItem("isInformCompleted");
        localStorage.removeItem("isBasicsCompleted");
        localStorage.removeItem("isRewardCompleted");
        localStorage.removeItem("percentage");
      } else {
        if (!isInformCompleted) {
          navigate("/add-project/inform");
        } else if (!isBasicsCompleted) {
          navigate("/add-project/basics");
        } else if (!isRewardCompleted) {
          navigate("/add-project/reward");
        }
      }
    } catch (error) {
      console.error("Error submitting project for approval:", error);
      const errorMessage = error.response
        ? error.response.data.message
        : "Bir hata oluştu, lütfen tekrar deneyin.";
      setErrorMessage(errorMessage);
    }
  };
  const areAllRequirementsCompleted = isInformCompleted && isBasicsCompleted && isRewardCompleted;

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Submit Your Project for Approval - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/add-project/submit" />
      </Helmet>
      <header className={styles.formHeader}>
        <h2 className={styles.sidebarTitle}>
          {areAllRequirementsCompleted
            ? "Submit Your Project for Approval"
            : "Complete All Requirements Before Submission"}
        </h2>
      </header>
  
      {submitMessage ? (
        <div className="submit-message">{submitMessage}</div>
      ) : (
        <div>
          {!areAllRequirementsCompleted && (
            <div>
              {!isInformCompleted && (
                <p>Please complete the inform section.</p>
              )}
              {!isBasicsCompleted && (
                <p>Please complete the basic information section.</p>
              )}
              {!isRewardCompleted && (
                <p>Please complete the reward section.</p>
              )}
            </div>
          )}
          {isCheckboxChecked && areAllRequirementsCompleted ? (
            <p className={styles.content}>
              If everything is in order, your project will be approved and will
              appear in the Projects section. If there are any issues, you will
              be contacted with details. You can track the status of your
              project in the "My Projects" section of your dashboard.
            </p>
          ) : (
            <p className={styles.content}>
              {areAllRequirementsCompleted
                ? "Please review the information you provided carefully. By checking the box below, you confirm that the information is accurate and complete. Upon submission, your project will be sent to Agricrowd for approval."
                : "Please complete all the requirements before submission."
              }
            </p>
          )}
        </div>
      )}
  
      {!submitMessage && areAllRequirementsCompleted && (
        <div>
          <div className={styles.checkboxLayout}>
            <input
              type="checkbox"
              className={styles.input}
              id="approvalCheckbox"
              checked={isCheckboxChecked}
              onChange={handleCheckboxChange}
              disabled={remainingTime > 0 && !isCheckboxChecked}
            />
            <label className={styles.label} htmlFor="approvalCheckbox">
              {remainingTime > 0
                ? `You can check the box in ${remainingTime} seconds`
                : "I confirm my project"}
            </label>
          </div>
  
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {isCheckboxChecked && (
            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={styles.button}
                onClick={handleApprovalSubmit}
                disabled={!isCheckboxChecked}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmitForm;
