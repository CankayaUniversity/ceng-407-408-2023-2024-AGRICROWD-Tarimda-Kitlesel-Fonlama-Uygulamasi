import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './InactiveProjects.module.css';

function InactiveProjects() {
  const [projects, setProjects] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page') ? parseInt(queryParams.get('page')) : 1;
    const search = queryParams.get('search') || "";

    setCurrentPage(page);
    setSearchQuery(search);
  }, [location]);

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

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const filteredProjects = projects.filter((project) =>
    project.basicInfo.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    const searchParam = searchQuery ? `&search=${searchQuery}` : '';
    navigate(`/user/my-projects/inactive?page=${pageNumber}${searchParam}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      setSearchQuery(searchInput);
      if (searchInput !== "") {
        navigate(`/user/my-projects/inactive?search=${searchInput}`);
      } else {
        navigate(`/user/my-projects/inactive`);
      }
    }
  };

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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className={styles.searchBar}
        />
      )}
      {currentProjects.length > 0 ? (
        currentProjects.map((project, index) => (
          <div key={index} className={styles.projectCard}>
            {projectCardContents(project)}
          </div>
        ))
      ) : (
        <p>
          You do not have any projects awaiting approval or with expired deadlines.
        </p>
      )}
      <div className={styles.pagination}>
        {[...Array(Math.ceil(filteredProjects.length / projectsPerPage)).keys()].map(number => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`${styles.pageItem} ${currentPage === number + 1 ? styles.active : ''}`}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function projectCardContents(project) {
  return (
    <div className={styles.projectCardLayout}>
      <div>
        {project.basicInfo.projectImages && project.basicInfo.projectImages.length > 0 ? (
          <div className={styles.projectImagesContainer}>
            {project.basicInfo.projectImages.map((photo, index) =>
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
          <div className={styles.noPhotos}>No photos available for this project!</div>
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
        <p className={styles.info}>Campaign Duration: {project.basicInfo.campaignDuration} days</p>
        <p className={styles.info}>Target Amount: {project.basicInfo.targetAmount}</p>
      </div>

      <div className={styles.statusContainer}>
        <p className={styles.info}>Status: {project.status}</p>
        {project.status === 'expired' && (
          <p className={styles.info}>Expired: {new Date(project.expiredDate).toLocaleString()}</p>
        )}
        {project.status === 'pending' && (
          <p className={styles.info}>Project is under review by our team. You will be contacted soon.</p>
        )}
        {project.status === 'rejected' && (
          <p className={styles.rejectionReason}>Rejection Reason: {project.rejectionReason}</p>
        )}
      </div>
    </div>
  );
}

export default InactiveProjects;
