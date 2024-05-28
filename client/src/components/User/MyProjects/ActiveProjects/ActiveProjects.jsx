import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';

import styles from './ActiveProjects.module.css';

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Arama sorgusu için state
  const navigate = useNavigate();

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
          `http://localhost:3001/api/user/projects/fetch-approved-projects?userId=${userId}`
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

  const calculateRemainingDays = (approvalDate, campaignDuration) => {
    const endDate = new Date(approvalDate);
    endDate.setDate(endDate.getDate() + parseInt(campaignDuration));
    const now = new Date();
    const difference = endDate - now;
    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const ProjectCard = ({ project }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const redirectToDashboard = (projectId) => {
      navigate(
        `/user/my-projects/${project.basicInfo.projectName
          .replace(/\s+/g, '-')
          .toLowerCase()}-pid-${projectId}/dashboard`
      );
    };

    const handleDropdownClick = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    return (
      <div style={{ display: 'flex' }}>
        {project.basicInfo.projectImages &&
        project.basicInfo.projectImages.length > 0 ? (
          <a
            href={`/project/${project.basicInfo.projectName
              .replace(/\s+/g, '-')
              .toLowerCase()}-pid-${project._id}`}
            className={styles.coverLink}
          >
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
          </a>
        ) : (
          <div className={styles.noCover}>No cover photo available</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignContent: 'center',
              padding: '0.5rem',
            }}
          >
            <h2 className={styles.title}>
              <a
                href={`/project/${project.basicInfo.projectName
                  .replace(/\s+/g, '-')
                  .toLowerCase()}-pid-${project._id}`}
                className={styles.titleLink}
              >
                {project.basicInfo.projectName}
              </a>
            </h2>

            <p className={styles.info}>
              {project.category.mainCategory.categoryName} -&gt;{' '}
              {project.category.subCategory.subCategoryName}
            </p>

            <p>
              <span>📍</span> {project.basicInfo.country}
            </p>
          </div>

          <div className={styles.infoContainer}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <p className={styles.info}>
                <span>🎯</span>
                <span className={styles.subTitle}>Target Amount: </span>{' '}
                {project.basicInfo.targetAmount} ETH
              </p>
              <p className={styles.subTitle}>Status: {project.status}</p>
              <p className={styles.subTitle}>
                Approval Date:{' '}
                {new Date(project.approvalDate).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            {project.status === 'approved' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <p className={styles.info}>
                    <span>⏱</span>
                    <span className={styles.subTitle}>
                      Days Remaining:{' '}
                    </span>{' '}
                    {calculateRemainingDays(
                      project.approvalDate,
                      project.basicInfo.campaignDuration
                    )}
                  </p>
                  <p className={styles.subTitle}>
                    Campaign Duration: {project.basicInfo.campaignDuration} days
                  </p>
                  <p className={styles.info}>
                    <span>📅</span>
                    <span className={styles.subTitle}>Expired Date: </span>{' '}
                    {new Date(project.expiredDate).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownBtn}
              onClick={handleDropdownClick}
            >
              Operations
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownContent}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => redirectToDashboard(project._id)}
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Active Projects - AGRICROWD</title>
        <link rel='canonical' href='http://localhost:3000/user/my-projects' />
      </Helmet>
      <h1>My Approved Projects</h1>
      {projects.length > 0 && (
        <input
          type='text'
          placeholder='Search...'
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
              project.status === 'approved' && (
                <div className={styles.projectCard}>
                  <ProjectCard project={project} />
                </div>
              )
          )
      ) : (
        <div>
          <p>You do not have any approved projects.</p>
          <Link to='/add-project/inform' className={styles.addButton}>
            If you have an idea...
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActiveProjects;
