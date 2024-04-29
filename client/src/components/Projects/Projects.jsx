import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Projects.module.css';

const ProjectCard = ({ project }) => (
  <div className={styles.cardContainer}>
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <h3 className={styles.projectTitle}>{project.projectName}</h3>
        <div className={styles.projectContent}>
        <div className={styles.projectDetail}>
            <h4>Project Name</h4>
            {project.basicInfo.projectName}
          </div>
          <div className={styles.projectDetail}>
            <h4>Country</h4> {project.basicInfo.country}
          </div>
          <div className={styles.projectDetail}>
            <h4>Target Amount</h4> {project.basicInfo.targetAmount}
          </div>
          <div className={styles.projectDetail}>
            <h4>Campaign Duration</h4> {project.basicInfo.campaignDuration} days
          </div>
        </div>
        {project.basicInfo.projectImages && project.basicInfo.projectImages.length > 0 ? (
          <div className={styles.projectImagesContainer}>
            <h4>Project Photos</h4>
            <div>
              {project.basicInfo.projectImages.map((photo, index) => (
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
          <div className={styles.noPhotos}>No photos available for this project!</div>
        )}
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/projects/approved');
        setApprovedProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approved projects:', error);
      }
    };

    fetchApprovedProjects();
  }, []);

  return (
    <div className={styles.pageLayout}>
      <h2 className={styles.title}>Approved Projects</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.gridContainer}>
          {approvedProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
