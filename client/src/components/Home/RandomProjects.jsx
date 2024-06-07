import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';

const RandomProjects = () => {
  const [randomProjects, setRandomProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchCoverImage = async (photoId) => {
    try {
      const coverImageResponse = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/photos/${photoId}`
      );
      return coverImageResponse.data.url;
    } catch (error) {
      console.error('Error fetching cover image:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRandomProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/projects/fetch-approved-projects`
        );
        
        const shuffledProjects = response.data
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
  
        const projectsWithImages = await Promise.all(
          shuffledProjects.map(async (project) => {
            const coverImageUrl = await fetchCoverImage(project.basicInfo.projectImages[project.basicInfo.coverImage] || 'default-image-url');
            return {
              ...project,
              coverImageUrl: coverImageUrl || 'default-image-url'
            };
          })
        );
  
        setRandomProjects(projectsWithImages);
      } catch (error) {
        console.error('Error fetching random projects:', error);
      }
    };
  
    fetchRandomProjects();
  }, []);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % randomProjects.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [randomProjects.length]);

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + randomProjects.length) % randomProjects.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % randomProjects.length);
  };

  return (
    <section className={styles.randomProjects}>
      {randomProjects.length > 0 && (
        <h2 style={{ margin: '1.5rem 0', textAlign: 'center' }}>
        Discover Random Projects
      </h2>
      )}
      <div className={styles.projectList}>
        {randomProjects.length > 0 && (
          <div
            className={styles.projectContainer}
            key={randomProjects[currentIndex]._id}
          >
            <button className={styles.prevButton} onClick={handlePrevClick}>
              ◀◀
            </button>
            <Link
              to={`/project/${randomProjects[currentIndex].basicInfo.projectName
                .replace(/\s+/g, '-')
                .toLowerCase()}-pid-${randomProjects[currentIndex]._id}`}
              className={styles.projectLink}
            >
              <div className={styles.projectCard}>
                <div className={styles.projectImageContainer}>
                  {randomProjects[currentIndex].coverImageUrl ? (
                    <img
                      src={randomProjects[currentIndex].coverImageUrl}
                      alt={`Project ${randomProjects[currentIndex]._id}`}
                      className={styles.projectImage}
                    />
                  ) : (
                    <div className={styles.noImage}>No Image Available</div>
                  )}
                </div>
                <div className={styles.projectContent}>
                  <h3>{randomProjects[currentIndex].basicInfo.projectName}</h3>
                  <p>
                    <strong>Target Amount:</strong>{' '}
                    {randomProjects[currentIndex].basicInfo.targetAmount} ETH
                  </p>
                  <p>
                    <strong>Listing Date:</strong>{' '}
                    {new Date(
                      randomProjects[currentIndex].approvalDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
            <button className={styles.nextButton} onClick={handleNextClick}>
              ▶▶
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RandomProjects;
