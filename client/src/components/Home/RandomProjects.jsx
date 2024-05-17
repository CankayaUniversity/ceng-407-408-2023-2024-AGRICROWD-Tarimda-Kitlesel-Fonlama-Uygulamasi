import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';

const RandomProjects = () => {
  const [randomProjects, setRandomProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRandomProjects = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/projects/fetch-approved-projects'
        );
        const shuffledProjects = response.data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRandomProjects(shuffledProjects);
      } catch (error) {
        console.error('Error fetching random projects:', error);
      }
    };

    fetchRandomProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % randomProjects.length);
    }, 5000); // 5 saniyede bir geçiş yap
    return () => clearInterval(interval);
  }, [randomProjects.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + randomProjects.length) % randomProjects.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % randomProjects.length);
  };

  return (
    <section className={styles.randomProjects}>
        <div class="grid-container">
            <h2>Discover Random Projects</h2>
        </div>
      <div className={styles.projectList}>
        {randomProjects.length > 0 && (
          <div className={styles.projectContainer} key={randomProjects[currentIndex]._id}>
            <button className={styles.prevButton} onClick={handlePrevClick}>◀◀</button>
            <Link to={`/project/${encodeURIComponent(randomProjects[currentIndex].basicInfo.projectName)}-pid-${randomProjects[currentIndex]._id}`} className={styles.projectLink}>
              <div className={styles.projectCard}>
                <div className={styles.projectImageContainer}>
                  {randomProjects[currentIndex].basicInfo.projectImages && randomProjects[currentIndex].basicInfo.projectImages.length > 0 ? (
                    <img
                      src={`http://localhost:3001/api/photos/${randomProjects[currentIndex].basicInfo.projectImages[0]._id}`}
                      alt={`Project ${randomProjects[currentIndex]._id}`}
                      className={styles.projectImage}
                    />
                  ) : (
                    <div className={styles.noImage}>No Image Available</div>
                  )}
                </div>
                <div className={styles.projectContent}>
                  <h3>{randomProjects[currentIndex].basicInfo.projectName}</h3>
                  <p><strong>Target Amount:</strong> ${randomProjects[currentIndex].basicInfo.targetAmount}</p>
                  <p><strong>Listed Date:</strong> {new Date(randomProjects[currentIndex].listingDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
            <button className={styles.nextButton} onClick={handleNextClick}>▶▶</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RandomProjects;
