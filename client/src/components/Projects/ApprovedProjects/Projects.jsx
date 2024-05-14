import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Projects.module.css';

const ProjectCard = ({ project }) => (
  <Link
    to={`/project/${project.basicInfo.projectName.replace(/\s+/g, '-').toLowerCase()}-pid-${project._id}`}
    className={styles.cardLink}
  >
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
              <h4>Campaign Duration</h4> {project.basicInfo.campaignDuration}{' '}
              days
            </div>
          </div>
          {project.basicInfo.projectImages &&
            project.basicInfo.projectImages.length > 0 ? (
            <div className={styles.projectImagesContainer}>
              <div>
                {project.basicInfo.projectImages.map((photo, index) => (
                  index === project.basicInfo.coverImage && (
                    <img
                      key={index}
                      src={`http://localhost:3001/api/photos/${photo._id}`}
                      alt={`Project ${index}`}
                      className={styles.projectImage}
                    />
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noPhotos}>
              No photos available for this project!
            </div>
          )}
        </div>
        <div className={styles.projectDetail}>
          <h4>Listing Date</h4> {new Date(project.approvalDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  </Link>
);

const Projects = () => {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [targetAmountFilter, setTargetAmountFilter] = useState('');

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/projects/fetch-approved-projects'
        );
        setApprovedProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approved projects:', error);
      }
    };

    fetchApprovedProjects();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/categories'
        );
        setCategories(response.data.map((category) => category.categoryName));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const sortProjects = (sortBy) => {
    let sortedProjects = [...approvedProjects];
    if (sortBy === 'longest') {
      sortedProjects.sort(
        (a, b) => b.basicInfo.campaignDuration - a.basicInfo.campaignDuration
      );
    } else if (sortBy === 'shortest') {
      sortedProjects.sort(
        (a, b) => a.basicInfo.campaignDuration - b.basicInfo.campaignDuration
      );
    } else if (sortBy === 'highestAmount') {
      sortedProjects.sort(
        (a, b) => b.basicInfo.targetAmount - a.basicInfo.targetAmount
      );
    } else if (sortBy === 'lowestAmount') {
      sortedProjects.sort(
        (a, b) => a.basicInfo.targetAmount - b.basicInfo.targetAmount
      );
    }
    return sortedProjects;
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
  };

  const handleTargetAmountFilter = (e) => {
    setTargetAmountFilter(e.target.value);
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.filters}>
        <h2 className={styles.title}>Approved Projects</h2>
        <div>
          <input
            type='text'
            placeholder='Search projects...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value=''>All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className={styles.categorySelect}
          >
            <option value=''>Sort By</option>
            <option value='longest'>Longest Campaign</option>
            <option value='shortest'>Shortest Campaign</option>
            <option value='highestAmount'>Highest Target Amount</option>
            <option value='lowestAmount'>Lowest Target Amount</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.gridContainer}>
          {sortProjects(sortBy)
            .filter(
              (project) =>
                project.basicInfo.projectName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) &&
                (selectedCategory
                  ? project.basicInfo.category === selectedCategory
                  : true) &&
                (targetAmountFilter
                  ? project.basicInfo.targetAmount >=
                  parseInt(targetAmountFilter)
                  : true)
            )
            .map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
