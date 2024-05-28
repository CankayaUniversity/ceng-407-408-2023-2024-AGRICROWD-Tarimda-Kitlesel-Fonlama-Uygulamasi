import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

import styles from './Projects.module.css';

const ProjectCard = ({ project }) => {
  const calculateDaysLeft = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? '1 day left' : `${diffDays} days left`;
  };

  return (
    <Link
      to={`/project/${project.basicInfo.projectName
        .replace(/\s+/g, '-')
        .toLowerCase()}-pid-${project._id}`}
      className={styles.cardLink}
    >
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <h3 className={styles.projectTitle}>
              {project.basicInfo.projectName}
            </h3>

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
                        className={styles.projectImage}
                      />
                    )
                )}
              </div>
            ) : (
              <div className={styles.noPhotos}>
                No photos available for this project!
              </div>
            )}

            <div className={styles.projectContent}>
              <div className={styles.projectDetail}>
                <div>
                  <span>📍</span>
                  <span style={{ fontWeight: '600' }}>Country</span>
                </div>
                {project.basicInfo.country}
              </div>
              <div className={styles.projectDetail}>
                <div>
                  <span>🎯</span>
                  <span style={{ fontWeight: '600' }}>Target Amount</span>
                </div>
                {project.basicInfo.targetAmount} ETH
              </div>
              <div className={styles.projectDetail}>
                <div>
                  <span>⏱</span>
                  <span style={{ fontWeight: '600' }}>Duration</span>
                </div>
                {calculateDaysLeft(project.expiredDate)}
              </div>
            </div>
          </div>
          <div
            style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem' }}
          >
            <p>
              <span style={{ marginRight: '.25rem' }}>📅</span>
              <span style={{ fontWeight: '600' }}>Listing Date: </span>
              <span>{new Date(project.approvalDate).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const { categoryNameandId } = useParams();
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [categoryName, categoryId] = categoryNameandId
    ? categoryNameandId.split('-cid-')
    : ['', ''];
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [targetAmountMin, setTargetAmountMin] = useState('');
  const [targetAmountMax, setTargetAmountMax] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [helmetTitle, setHelmetTitle] = useState(
    'Projects That Will Touch Our Lives - AGRICROWD'
  );
  const [helmetLink, setHelmetLink] = useState(
    'http://localhost:3000/projects'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4; 

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
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/categories/fetch-both'
        );
        if (response.data.success) {
          setCategories(response.data.categoriesWithSubCategories);
        } else {
          setErrorMessage('No categories found!');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (categoryNameandId && categories.length > 0) {
      const category =
        categories.find((cat) => cat._id === categoryId) ||
        categories.find((cat) =>
          cat.subCategories.some((subCat) => subCat._id === categoryId)
        );
      if (category) {
        const isSubCategory =
          category.subCategories && category.subCategories.length > 0;
        const targetCategoryId = isSubCategory
          ? categoryId
          : category.mainCategory;
        const filtered = approvedProjects.filter(
          (project) =>
            project.category.mainCategory === targetCategoryId ||
            (isSubCategory && project.category.subCategory === targetCategoryId)
        );
        setFilteredProjects(filtered);

        let breadcrumbItems = [
          { name: 'Home', link: '/' },
          { name: 'Projects', link: '/projects' },
        ];

        if (category._id === categoryId) {
          breadcrumbItems.push({
            name: category.categoryName,
            link: `/projects/${category.categoryName
              .replace(/\s+/g, '-')
              .toLowerCase()}-cid-${categoryId}`,
          });
          setHelmetTitle(`${category.categoryName} Projects - AGRICROWD`);
          setHelmetLink(
            `http://localhost:3000/projects/${category.categoryName
              .replace(/\s+/g, '-')
              .toLowerCase()}-cid-${categoryId}`
          );
        } else if (isSubCategory) {
          const subCategory = category.subCategories.find(
            (subCat) => subCat._id === categoryId
          );
          if (subCategory) {
            const parentCategory = categories.find(
              (cat) => cat._id === subCategory.mainCategory
            );
            breadcrumbItems.push({
              name: parentCategory?.categoryName,
              link: `/projects/${parentCategory?.categoryName
                .replace(/\s+/g, '-')
                .toLowerCase()}-cid-${parentCategory?._id}`,
            });
            breadcrumbItems.push({
              name: subCategory.subCategoryName,
              link: `/projects/${subCategory.subCategoryName
                .replace(/\s+/g, '-')
                .toLowerCase()}-cid-${categoryId}`,
            });
            setHelmetTitle(
              `${subCategory.subCategoryName} Projects - AGRICROWD`
            );
            setHelmetLink(
              `http://localhost:3000/projects/${subCategory.subCategoryName
                .replace(/\s+/g, '-')
                .toLowerCase()}-cid-${categoryId}`
            );
          }
        } else {
          setHelmetTitle('Projects That Will Touch Our Lives - AGRICROWD');
          setHelmetLink('http://localhost:3000/projects');
        }

        setBreadcrumb(breadcrumbItems);
      }
    } else {
      setFilteredProjects(approvedProjects);
      setBreadcrumb([
        { name: 'Home', link: '/' },
        { name: 'Projects', link: '/projects' },
      ]);
      setHelmetTitle('Projects That Will Touch Our Lives - AGRICROWD');
      setHelmetLink('http://localhost:3000/projects');
    }
  }, [categoryId, categoryNameandId, approvedProjects, categories]);

  const sortProjects = (projects, sortBy) => {
    let sortedProjects = [...projects];
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

  const handleCategoryClick = (categoryId, categoryName) => {
    setSearchTerm('');
    setTargetAmountMin('');
    setTargetAmountMax('');
    if (categoryId) {
      setCurrentPage(1);
      window.location.href = `/projects/${categoryName
        .replace(/\s+/g, '-')
        .toLowerCase()}-cid-${categoryId}`;
    } else {
      setFilteredProjects(approvedProjects);
    }
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
    setCurrentPage(1);
  };

  const handleTargetAmountMin = (e) => {
    setTargetAmountMin(e.target.value);
  };

  const handleTargetAmountMax = (e) => {
    setTargetAmountMax(e.target.value);
  };

  const filteredAndSortedProjects = sortProjects(
    filteredProjects,
    sortBy
  ).filter((project) => {
    const matchesSearchTerm = project.basicInfo.projectName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTargetAmountMin = targetAmountMin
      ? project.basicInfo.targetAmount >= parseInt(targetAmountMin)
      : true;
    const matchesTargetAmountMax = targetAmountMax
      ? project.basicInfo.targetAmount <= parseInt(targetAmountMax)
      : true;
    return matchesSearchTerm && matchesTargetAmountMin && matchesTargetAmountMax;
  });

  // Paging işlemi için proje dilimleme
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredAndSortedProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(filteredAndSortedProjects.length / projectsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      navigate(`/projects?page=${currentPage + 1}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if(currentPage - 1 === 1){
        navigate(`/projects`);
      } else {
        navigate(`/projects?page=${currentPage - 1}`);
      }
    }
  };

  return (
    <div className={styles.pageLayout}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{helmetTitle}</title>
        <link rel='canonical' href={helmetLink} />
      </Helmet>
      <h2 style={{ textAlign: 'center', fontWeight: '300' }}>
        Thanks to you, projects that can touch our lives
      </h2>
      <nav className={styles.breadcrumb}>
        <div>
          {breadcrumb.map((item, index) => (
            <span key={index}>
              <Link to={item.link}>{item.name}</Link>
              {index !== breadcrumb.length - 1 && ' > '}
            </span>
          ))}
        </div>

        <div className={styles.sortContainer}>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className={styles.sortSelect}
          >
            <option value=''>Sort By</option>
            <option value='longest'>Longest Campaign</option>
            <option value='shortest'>Shortest Campaign</option>
            <option value='highestAmount'>Highest Target Amount</option>
            <option value='lowestAmount'>Lowest Target Amount</option>
          </select>
        </div>
      </nav>
      <div className={styles.contentLayout}>
        <div className={styles.sidebar}>
          <h2 className={styles.title}>Filters</h2>
          <input
            type='text'
            placeholder='Search projects...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <div key={category._id}>
                <div
                  className={styles.mainCategory}
                  onClick={() =>
                    handleCategoryClick(category._id, category.categoryName)
                  }
                >
                  {category.categoryName}
                </div>
                {category.subCategories &&
                  category.subCategories.map((subCategory) => (
                    <div
                      key={subCategory._id}
                      className={styles.subCategory}
                      onClick={() =>
                        handleCategoryClick(
                          subCategory._id,
                          subCategory.subCategoryName
                        )
                      }
                    >
                      {subCategory.subCategoryName}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <input
            type='number'
            placeholder='Minimum Target Amount'
            value={targetAmountMin}
            onChange={handleTargetAmountMin}
            className={styles.targetAmountInput}
          />
          <input
            type='number'
            placeholder='Maximum Target Amount'
            value={targetAmountMax}
            onChange={handleTargetAmountMax}
            className={styles.targetAmountInput}
          />
        </div>
        <div className={styles.gridContainer}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            currentProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          )}
        </div>
      </div>
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Projects;
