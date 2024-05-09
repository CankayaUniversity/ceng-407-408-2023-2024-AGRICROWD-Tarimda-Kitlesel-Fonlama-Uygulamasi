import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../NotFound/NotFound.jsx';
import './ProjectDetails.module.css';

const ProjectDetail = () => {
  const { projectNameandId } = useParams();
  const [encodedProjectName, pId] = projectNameandId.split("-pid-");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.post(`http://localhost:3001/api/projects/details`, { projectId: pId });
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
    const remainingTimeInSeconds = campaignDuration * 24 * 60 * 60 - timeDifference;

    // Girişten geçen süreyi hesapla
    const elapsedTimeInSeconds = Math.max((currentDate - loginTime) / 1000, 0);
    const remainingTimeAdjusted = remainingTimeInSeconds - elapsedTimeInSeconds;

    const days = Math.floor(remainingTimeAdjusted / (24 * 60 * 60));
    const hours = Math.floor((remainingTimeAdjusted % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((remainingTimeAdjusted % (60 * 60)) / 60);

    setRemainingTime({ days, hours, minutes });
  };

  const handleInvalidUrl = () => {
    const correctedUrl = `/project/${encodeURIComponent(project.basicInfo.projectName)}-pid-${pId}`;
    navigate(correctedUrl);
  };

  useEffect(() => {
    if (project && (project.basicInfo.projectName != encodedProjectName)) {
      handleInvalidUrl();
    }
  }, [project]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.basicInfo.projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.basicInfo.projectImages.length) % project.basicInfo.projectImages.length);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="project-detail-container">
      <div className="slider-container">
        <div className="slider">
          {project.basicInfo.projectImages && project.basicInfo.projectImages.length > 0 ? (
            <div className="main-image-container">
              <img
                className="main-image"
                src={`http://localhost:3001/api/photos/${project.basicInfo.projectImages[currentImageIndex]._id}`}
                alt={`Project ${currentImageIndex}`}
              />
              <button onClick={prevImage}>Previous</button>
              <button onClick={nextImage}>Next</button>
            </div>
          ) : (
            <div>No photos available for this project!</div>
          )}
        </div>
      </div>
      <div className="thumbnail-container">
        {project.basicInfo.projectImages.map((photo, index) => (
          <div key={index} className="thumbnail">
            <img
              src={`http://localhost:3001/api/photos/${photo._id}`}
              alt={`Project ${index}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          </div>
        ))}
      </div>
      <div className="project-info">
        <h3>{project.basicInfo.projectName}</h3>
        <p>{project.basicInfo.projectDescription}</p>
        <p>Category: {project.basicInfo.category}</p>
        <p>Subcategory: {project.basicInfo.subCategory}</p>
        <p>Country: {project.basicInfo.country}</p>
        <p>Target Amount: {project.basicInfo.targetAmount} ETH (1 ETH = 5000$)</p>
        <p>Campaign Duration: {project.basicInfo.campaignDuration} days</p>
        <p>Investment Remaining Time: {remainingTime && `${remainingTime.days} days, ${remainingTime.hours} hours, ${remainingTime.minutes} minutes left`}</p>
      </div>
    </div>
  );
};

export default ProjectDetail;