import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';

import styles from './InactiveProjects.module.css';

function InactiveProjects() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Arama sorgusu için state

  useEffect(() => {
    const authToken = Cookies.get('authToken');

    const fetchUserId = async () => {
      if (authToken) {
        try {
          const authResponse = await axios.post(
            'http://localhost:3001/api/auth',
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );

          if (authResponse.data.success) {
            fetchProjects(authResponse.data.user._id);
          } else {
            console.error('Kullanıcı kimliği alınamadı.');
          }
        } catch (error) {
          console.error('Sunucuyla iletişim hatası:', error);
        }
      }
    };

    const fetchProjects = async (userId) => {
      try {
        const projectResponse = await axios.get(
          `http://localhost:3001/api/user/projects/fetch-inactive-projects?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        if (projectResponse.data.length > 0) {
          setProjects(projectResponse.data);
        } else {
          console.error('No projects found or failed to load projects.');
        }
      } catch (error) {
        console.error('Projeler yüklenirken hata oluştu:', error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Inactive Projects - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/user/my-projects/inactive" />
      </Helmet>
      <h1>My Inactive Projects</h1>
      {projects.length > 0 && (
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
      )}
      {projects.length > 0 ? (
        projects
          .filter((project) =>
            project.basicInfo.projectName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
          .map(
            (project, index) =>
              (project.status === 'pending' ||
                project.status === 'rejected' ||
                project.status === 'expired') && (
                <div className={styles.projectCard}>
                  {projectCardContents(project)}
                </div>
              )
          )
      ) : (
        <p>
          You do not have any projects awaiting approval or with expired
          deadlines.
        </p>
      )}
    </div>
  );
}

function projectCardContents(project) {
  return (
    <div className={styles.projectCardLayout}>
      <div>
        {project.basicInfo.projectImages &&
          project.basicInfo.projectImages.length > 0 ? (
          <div className={styles.projectImagesContainer}>
            {project.basicInfo.projectImages.map(
              (photo, index) =>
                index === project.basicInfo.coverImage && (
                  <img
                    key={index}
                    src={`http://localhost:3001/api/photos/${photo}`}
                    alt={`Project ${index}`}
                    className={styles.coverImage}
                  />
                )
            )}
          </div>
        ) : (
          <div className={styles.noPhotos}>
            No photos available for this project!
          </div>
        )}
      </div>

      <div className={styles.projectInformation}>
        <div className={styles.header}>
          <h2 className={styles.title}>{project.basicInfo.projectName}</h2>
          <p className={styles.info}>
            {project.category.mainCategory.categoryName} -&gt; {project.category.subCategory.subCategoryName}
          </p>
        </div>
        <p className={styles.info}>Country: {project.basicInfo.country}</p>
        <p className={styles.info}>
          Campaign Duration: {project.basicInfo.campaignDuration} days
        </p>
        <p className={styles.info}>
          Target Amount: {project.basicInfo.targetAmount}
        </p>
      </div>

      <div className={styles.statusContainer}>
        <p className={styles.info}>Status: {project.status}</p>
        {project.status === 'expired' && (
          <p className={styles.info}>Expired: {project.expirationDate}</p>
        )}
        {project.status === 'pending' && (
          <p className={styles.info}>
            Project is under review by our team. You will be contacted soon.
          </p>
        )}
        {project.status === 'rejected' && (
          <p className={styles.rejectionReason}>
            Rejection Reason: {project.rejectionReason}
          </p>
        )}
      </div>
    </div>
  );
}

export default InactiveProjects;
