import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../NotFound/NotFound.jsx';
import styles from './ProjectDetails.module.css';

const ProjectDetail = () => {
  const { projectNameandId } = useParams();
  const [encodedProjectName, pId] = projectNameandId.split('-pid-');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

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
        console.error('Error fetching project:', error);
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
          <div style={{ display: 'flex', gap: '.5rem' }}>
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
          <span>⏱️</span> Investment Remaining Time:{' '}
          {remainingTime &&
            `${remainingTime.days} days, ${remainingTime.hours} hours, ${remainingTime.minutes} minutes left`}
        </p>
      </div>
    </div>
  );
};

export default ProjectDetail;
