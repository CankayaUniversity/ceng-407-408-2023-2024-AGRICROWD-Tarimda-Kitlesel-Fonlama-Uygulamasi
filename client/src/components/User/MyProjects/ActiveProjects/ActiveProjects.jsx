import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import styles from './ActiveProjects.module.css';

const ActiveProjects = () => {
    const [projects, setProjects] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
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
                            withCredentials: true
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
            navigate(`/user/my-projects/${project.basicInfo.projectName.replace(/\s+/g, '-').toLowerCase()}-pid-${projectId}/dashboard`);
        };

        const handleDropdownClick = () => {
            setIsDropdownOpen(!isDropdownOpen);
        };

        return (
            <div className={styles.projectCard}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            <a
                                href={`/project/${project.basicInfo.projectName.replace(/\s+/g, '-').toLowerCase()}-pid-${project._id}`}
                                className={styles.titleLink}
                            >
                                {project.basicInfo.projectName}
                            </a>
                        </h2>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.imageContent}>
                            <div className={styles.cover}>
                                <a
                                    href={`/project/${project.basicInfo.projectName.replace(/\s+/g, '-').toLowerCase()}-pid-${project._id}`}
                                    className={styles.coverLink}
                                >
                                    {project.basicInfo.projectImages && project.basicInfo.projectImages.length > 0 ? (
                                        <img
                                            src={`http://localhost:3001/api/photos/${project.basicInfo.projectImages[project.basicInfo.coverImage]}`}
                                            alt="Project Cover"
                                            className={styles.coverImage}
                                        />
                                    ) : (
                                        <div className={styles.noCover}>No cover photo available</div>
                                    )}
                                </a>
                            </div>
                        </div>
                        <div className={styles.details}>
                            <p className={styles.info}>
                                {project.category.mainCategory.categoryName} -&gt; {project.category.subCategory.subCategoryName}
                            </p>
                            <p className={styles.info}>Country: {project.basicInfo.country}</p>
                            <p className={styles.info}>Campaign Duration: {project.basicInfo.campaignDuration} days</p>
                            <p className={styles.info}>Target Amount: {project.basicInfo.targetAmount}</p>
                        </div>
                        <div className={styles.approvalInfo}>
                            <p className={styles.info}>
                                <span>Status: </span>
                                <span className={project.status === 'approved' ? styles.approved : ''}>{project.status}</span>
                            </p>
                            {project.status === 'approved' && (
                                <>
                                    <p className={styles.info}>
                                        Approval Date:{" "}
                                        {new Date(project.approvalDate).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                    <p className={styles.info}>
                                        Expired Date:{" "}
                                        {new Date(project.expiredDate).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                    <p className={styles.info}>Days Remaining: {calculateRemainingDays(project.approvalDate, project.basicInfo.campaignDuration)}</p>
                                </>
                            )}
                        </div>
                        <div className={styles.dropdown}>
                            <button className={styles.dropdownBtn} onClick={handleDropdownClick}>
                                Operations
                            </button>
                            {isDropdownOpen && (
                                <div className={styles.dropdownContent}>
                                    <button className={styles.dropdownItem} onClick={() => redirectToDashboard(project._id)}>Dashboard</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        );
    };

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
        if (pageNumber === 1) {
            navigate(`/user/my-projects`);
        } else {
            if (searchQuery) {
                navigate(`/user/my-projects?search=${searchQuery}&page=${pageNumber}`);
            }
            else {
                navigate(`/user/my-projects?page=${pageNumber}`);
            }
        }
    };

    return (
        <div className={styles.container}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Active Projects - AGRICROWD</title>
                <link rel="canonical" href="http://localhost:3000/user/my-projects" />
            </Helmet>
            <h1>My Approved Projects</h1>
            {projects.length > 0 && (
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setCurrentPage(1);
                            navigate(`/user/my-projects?&search=${e.target.value}`);
                        }
                    }}
                    className={styles.searchBar}
                />
            )}
            {currentProjects.length > 0 ? (
                currentProjects
                    .filter((project) => {
                        const projectName = project.basicInfo.projectName.toLowerCase();
                        const searchLowerCase = searchQuery.toLowerCase();
                        return project.status === 'approved' && projectName.includes(searchLowerCase);
                    })
                    .map((project, index) => (
                        <div key={index} className={styles.projectCardWrapper}>
                            <ProjectCard project={project} />
                        </div>
                    ))
            ) : (
                <div>
                    <p>You do not have any approved projects.</p>
                    <Link to="/add-project/inform" className={styles.addButton}>
                        If you have an idea...
                    </Link>
                </div>
            )}
            <div className={styles.pagination}>
                {[...Array(Math.ceil(projects.length / projectsPerPage)).keys()].map(number => (
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

export default ActiveProjects;
