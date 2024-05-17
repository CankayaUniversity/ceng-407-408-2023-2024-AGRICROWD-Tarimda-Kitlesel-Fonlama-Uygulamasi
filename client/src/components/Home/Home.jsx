import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Home.module.css';

// Rastgele üç proje gösteren bileşen
const RandomProjects = () => {
  const [randomProjects, setRandomProjects] = useState([]);

  useEffect(() => {
    const fetchRandomProjects = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/projects/fetch-approved-projects'
        );
        // Rastgele üç proje seç
        const shuffledProjects = response.data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRandomProjects(shuffledProjects);
      } catch (error) {
        console.error('Error fetching random projects:', error);
      }
    };

    fetchRandomProjects();
  }, []);

  return (
    <section className={styles.randomProjects}>
      <h2>Discover Random Projects</h2>
      <div className={styles.projectList}>
        {randomProjects.map(project => (
          <Link key={project._id} to={`/project/${encodeURIComponent(project.basicInfo.projectName)}-pid-${project._id}`} className={styles.projectLink}>
            <div className={styles.projectCard}>
              <div className={styles.projectImageContainer}>
                {project.basicInfo.projectImages && project.basicInfo.projectImages.length > 0 ? (
                  <img
                    src={`http://localhost:3001/api/photos/${project.basicInfo.projectImages[0]._id}`}
                    alt={`Project ${project._id}`}
                    className={styles.projectImage}
                  />
                ) : (
                  <div className={styles.noImage}>No Image Available</div>
                )}
              </div>
              <div className={styles.projectContent}>
                <h3>{project.basicInfo.projectName}</h3>
                <p><strong>Target Amount:</strong> ${project.basicInfo.targetAmount}</p>
                <p><strong>Listed Date:</strong> {new Date(project.listingDate).toLocaleDateString()}</p>
                {/* Diğer proje bilgileri buraya eklenebilir */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <section
      className={styles.container}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/main-img.jpg)`,
      }}
    >
      <p className={styles.heroText}>
        <div>Your hub for agricultural</div>
        <div>projects and collaboration</div>
      </p>
      <p className={styles.subText}>Ready to get started?</p>
      <Link to='/add-project/inform'>
        <button className={styles.button}>Add Your Project</button>
      </Link>
    </section>
    {/* Rastgele projeleri gösteren bileşeni ekle */}
    <RandomProjects />
  </>
);

export default Home;
