import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
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
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.8rem',
            }}
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
  const { search } = useLocation();
  const { categoryNameandId } = useParams();
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [categoryName, categoryId] = categoryNameandId ? categoryNameandId.split('-cid-') : ['', ''];
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [targetAmountMin, setTargetAmountMin] = useState('');
  const [targetAmountMax, setTargetAmountMax] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [helmetTitle, setHelmetTitle] = useState('Projects That Will Touch Our Lives - AGRICROWD');
  const [helmetLink, setHelmetLink] = useState('http://localhost:3000/projects');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  const updateURLWithFilters = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    console.log("sortBy", sortBy);
    if (sortBy) params.append('sort', sortBy);
    if (targetAmountMin && targetAmountMax) {
      params.append('amount', `${targetAmountMin}-${targetAmountMax}`);
    } else if (targetAmountMax) {
      params.append('amount', `min-${targetAmountMax}`);
    } else if (targetAmountMin) {
      params.append('amount', `${targetAmountMin}-max`);
    }
    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/projects/fetch-approved-projects');
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
        const response = await axios.get('http://localhost:3001/api/categories/fetch-both');
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
      const category = categories.find((cat) => cat._id === categoryId) || categories.find((cat) => cat.subCategories.some((subCat) => subCat._id === categoryId));
      if (category) {
        const isSubCategory = category.subCategories && category.subCategories.length > 0;
        const targetCategoryId = isSubCategory ? categoryId : category.mainCategory;
        const filtered = approvedProjects.filter(
          (project) => project.category.mainCategory === targetCategoryId || (isSubCategory && project.category.subCategory === targetCategoryId)
        );
        setFilteredProjects(filtered);

        let breadcrumbItems = [
          { name: 'Home', link: '/' },
          { name: 'Projects', link: '/projects' },
        ];

        if (category._id === categoryId) {
          breadcrumbItems.push({
            name: category.categoryName,
            link: `/projects/${category.categoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${categoryId}`,
          });
          setHelmetTitle(`${category.categoryName} Projects - AGRICROWD`);
          setHelmetLink(`http://localhost:3000/projects/${category.categoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${categoryId}`);
        } else if (isSubCategory) {
          const subCategory = category.subCategories.find((subCat) => subCat._id === categoryId);
          if (subCategory) {
            const parentCategory = categories.find((cat) => cat._id === subCategory.mainCategory);
            breadcrumbItems.push({
              name: parentCategory?.categoryName,
              link: `/projects/${parentCategory?.categoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${parentCategory?._id}`,
            });
            breadcrumbItems.push({
              name: subCategory.subCategoryName,
              link: `/projects/${subCategory.subCategoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${categoryId}`,
            });
            setHelmetTitle(`${subCategory.subCategoryName} Projects - AGRICROWD`);
            setHelmetLink(`http://localhost:3000/projects/${subCategory.subCategoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${categoryId}`);
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

  useEffect(() => {
    const params = new URLSearchParams(search);
    setSearchTerm(params.get('search') || '');
    setSortBy(params.get('sort') || '');
    const amountParam = params.get('amount');
    if (amountParam) {
      const [minimum, maximum] = amountParam.split('-');
      if ((minimum === 'min' || minimum === '0') && maximum) {
        setTargetAmountMin(0);
        setTargetAmountMax(maximum);
      } else if (minimum && maximum === 'max') {
        setTargetAmountMin(minimum);
        //setTargetAmountMax(9999);
      } else {
        setTargetAmountMin(minimum);
        setTargetAmountMax(maximum);
      }
    } else {
      setTargetAmountMin('');
      setTargetAmountMax('');
    }

    // Apply filters and sorting to the filtered projects
    let projects = [...approvedProjects];
    if (categoryId) {
      projects = projects.filter(
        (project) => project.category.mainCategory === categoryId || project.category.subCategory === categoryId
      );
    }

    if (params.get('search')) {
      projects = projects.filter((project) =>
        project.basicInfo.projectName.toLowerCase().includes(params.get('search').toLowerCase())
      );
    }

    if (sortBy === 'longest') {
      projects.sort((a, b) => {
        const durationA = new Date(a.endDate) - new Date(a.startDate);
        const durationB = new Date(b.endDate) - new Date(b.startDate);
        return durationB - durationA;
      });
    } else if (sortBy === 'shortest') {
      projects.sort((a, b) => {
        const durationA = new Date(a.endDate) - new Date(a.startDate);
        const durationB = new Date(b.endDate) - new Date(b.startDate);
        return durationA - durationB;
      });
    } else if (sortBy === 'highestAmount') {
      projects.sort((a, b) => b.basicInfo.targetAmount - a.basicInfo.targetAmount);
    } else if (sortBy === 'lowestAmount') {
      projects.sort((a, b) => a.basicInfo.targetAmount - b.basicInfo.targetAmount);
    } else {
      projects.sort((a, b) => new Date(b.approvalDate) - new Date(a.approvalDate));
    }


    const minAmount = parseFloat(targetAmountMin);
    const maxAmount = parseFloat(targetAmountMax);

    if (!isNaN(minAmount)) {
      projects = projects.filter((project) => project.basicInfo.targetAmount >= minAmount);
    }

    if (!isNaN(maxAmount)) {
      projects = projects.filter((project) => project.basicInfo.targetAmount <= maxAmount);
    }

    setFilteredProjects(projects);
  }, [search, approvedProjects, categoryId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (sortBy !== '') {
      updateURLWithFilters();
    }
  }, [sortBy]);

  const handleTargetAmountMin = (e) => {
    setTargetAmountMin(e.target.value);
  };

  const handleTargetAmountMax = (e) => {
    setTargetAmountMax(e.target.value);
  };

  const handleFilterAndSort = () => {
    updateURLWithFilters();
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(
    filteredProjects.length / projectsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      navigate(`/projects?page=${currentPage + 1}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (currentPage - 1 === 1) {
        navigate(`/projects`);
      } else {
        navigate(`/projects?page=${currentPage - 1}`);
      }
    }
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

  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isTargetAmountClicked, setIsTargetAmountClicked] = useState(false);

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
            <span key={index} style={{ fontWeight: '500', fontSize: '1rem' }}>
              <Link to={item.link}>{item.name}</Link>
              {index !== breadcrumb.length - 1 && ' > '}
            </span>
          ))}
        </div>

        <div className={styles.sortContainer}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
        <div className={styles.sidebar} style={{ overflowY: 'auto' }}>
          <div className={styles.filters}>
            <h3>Categories</h3>
            <ul className={styles.categoryList}>
              <li className={styles.mainCategory}>
                <a href="/projects">All Projects</a>
                <ul className={styles.subCategoryList}>
                  {categories.map((category) => (
                    <li key={category._id} className={styles.mainCategory}>
                      <div onClick={() => handleCategoryClick(category._id, category.categoryName)}>
                        {category.categoryName}
                      </div>
                      {category.subCategories && (
                        <ul className={styles.subCategoryList}>
                          {category.subCategories.map((subCategory) => (
                            <li key={subCategory._id} className={styles.subCategory}>
                              <div onClick={() => handleCategoryClick(subCategory._id, subCategory.subCategoryName)}>
                                {subCategory.subCategoryName}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div>
            <div className={styles.filter}>
              <label>Search with words:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Enter keywords"
                onFocus={() => setIsSearchClicked(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilterAndSort();
                  }
                }}
              />
              {isSearchClicked && (searchTerm !== "") && (
                <button onClick={() => {
                  handleFilterAndSort();
                  setIsSearchClicked(false);
                }}>Apply</button>
              )}
            </div>
            <div className={styles.filter}>
              <label>Target Amount</label>
              <div className={styles.targetAmount}>
                <input
                  type="number"
                  value={targetAmountMin}
                  onChange={handleTargetAmountMin}
                  placeholder="Min"
                  onFocus={() => setIsTargetAmountClicked(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFilterAndSort();
                    }
                  }}
                />
                <input
                  type="number"
                  value={targetAmountMax}
                  onChange={handleTargetAmountMax}
                  placeholder="Max"
                  onFocus={() => setIsTargetAmountClicked(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFilterAndSort();
                    }
                  }}
                />
              </div>
              {isTargetAmountClicked && ((targetAmountMin !== "") || (targetAmountMax !== "")) && (
                <button onClick={() => {
                  handleFilterAndSort();
                  setIsSearchClicked(false);
                }}>Apply</button>
              )}
            </div>
          </div>
          <button className={styles.applyButton} onClick={handleFilterAndSort}>Apply All Filters</button>
        </div>
        <div className={styles.gridContainer}>
          {loading ? (
            <div>Loading...</div>
          ) : currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <div className={styles.noProjectsMessage}>
              <div className={styles.warningIcon}>⚠️</div>
              No projects found matching the filters.
            </div>
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
    </div >
  );
};

export default Projects;
