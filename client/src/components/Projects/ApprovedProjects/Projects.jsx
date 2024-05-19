import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
          <h3 className={styles.projectTitle}>{project.basicInfo.projectName}</h3>
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
                      src={`http://localhost:3001/api/photos/${photo}`}
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
  const { categoryNameandId } = useParams();
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [categoryName, categoryId] = categoryNameandId ? categoryNameandId.split('-cid-') : ['', ''];
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [targetAmountFilter, setTargetAmountFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);

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
        const response = await axios.get('http://localhost:3001/api/categories/fetch-both');
        if (response.data.success) {
          setCategories(response.data.categoriesWithSubCategories);
        } else {
          setErrorMessage("No categories found!");
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (categoryNameandId && categories.length > 0) {
      const category = categories.find(cat => cat._id === categoryId) ||
                       categories.find(cat => cat.subCategories.some(subCat => subCat._id === categoryId));
      if (category) {
        const isSubCategory = category.subCategories && category.subCategories.length > 0;
        const targetCategoryId = isSubCategory ? categoryId : category.mainCategory;
        const filtered = approvedProjects.filter(
          (project) =>
            project.category.mainCategory === targetCategoryId ||
            (isSubCategory && project.category.subCategory === targetCategoryId)
        );
        setFilteredProjects(filtered);
  
        let breadcrumbItems = [
          { name: "Home", link: "/" },
          { name: "Projects", link: "/projects" }
        ];
        
        if (category._id === categoryId) {
          breadcrumbItems.push({ name: category.categoryName, link: `/projects/${category.categoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${categoryId}` });
        }
        else if(isSubCategory) {
          const subCategory = category.subCategories.find(subCat => subCat._id === categoryId);
          if (subCategory) {
            const parentCategory = categories.find(cat => cat._id === subCategory.mainCategory);
            breadcrumbItems.push({ name: parentCategory?.categoryName, link: `/projects/${parentCategory?.categoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${parentCategory?._id}` });
            breadcrumbItems.push({ name: subCategory.subCategoryName, link: `/projects/${subCategory.subCategoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${categoryId}` });
          }
        } 
  
        setBreadcrumb(breadcrumbItems);
      }
    } else {
      setFilteredProjects(approvedProjects);
      setBreadcrumb([
        { name: "Home", link: "/" },
        { name: "Projects", link: "/projects" }
      ]);
    }
  }, [categoryNameandId, approvedProjects, categories]);
  
  





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

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    window.location.href = `/projects/${categoryName.replace(/\s+/g, '-').toLowerCase()}-cid-${categoryId}`;
  };

  const handleTargetAmountFilter = (e) => {
    setTargetAmountFilter(e.target.value);
  };

  const filteredAndSortedProjects = sortProjects(filteredProjects, sortBy)
    .filter(
      (project) =>
        project.basicInfo.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (targetAmountFilter ? project.basicInfo.targetAmount >= parseInt(targetAmountFilter) : true)
    );

  return (
    <div className={styles.pageLayout}>
      <h2>Thanks to you, projects that can touch our lives</h2>
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
            <option value="">Sort By</option>
            <option value="longest">Longest Campaign</option>
            <option value="shortest">Shortest Campaign</option>
            <option value="highestAmount">Highest Target Amount</option>
            <option value="lowestAmount">Lowest Target Amount</option>
          </select>
        </div>
      </nav>
      <div className={styles.contentLayout}>
        <div className={styles.sidebar}>
          <h2 className={styles.title}>Filters</h2>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <div key={category._id}>
                <div
                  className={styles.mainCategory}
                  onClick={() => handleCategoryClick(category._id, category.categoryName)}
                >
                  {category.categoryName}
                </div>
                {category.subCategories &&
                  category.subCategories.map((subCategory) => (
                    <div
                      key={subCategory._id}
                      className={styles.subCategory}
                      onClick={() => handleCategoryClick(subCategory._id, subCategory.subCategoryName)}
                    >
                      {subCategory.subCategoryName}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <input
            type="number"
            placeholder="Minimum Target Amount"
            value={targetAmountFilter}
            onChange={handleTargetAmountFilter}
            className={styles.targetAmountInput}
          />
        </div>
        <div className={styles.gridContainer}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            filteredAndSortedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
