import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DashboardforActiveProject.module.css';

function DashboardforActiveProject() {
    const [project, setProject] = useState(null);
    const { projectNameandID } = useParams();
    const [encodedProjectName, projectId] = projectNameandID.split("-pid-");
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const handleInvalidUrl = useCallback(() => {
        const projectNameInUrl = project.basicInfo.projectName.replace(/\s+/g, '-').toLowerCase();
        const correctedUrl = `/user/my-projects/${projectNameInUrl}-pid-${project._id}/dashboard`;
        navigate(correctedUrl);
    }, [project, navigate]);
    
    useEffect(() => {
        if (project && project.basicInfo.projectName !== encodedProjectName) {
            handleInvalidUrl();
        }
    }, [project, encodedProjectName, handleInvalidUrl]);

    useEffect(() => {
        const authToken = Cookies.get('authToken');

        const fetchProject = async () => {
            try {
                const projectResponse = await axios.post(
                    `http://localhost:3001/api/projects/fetch-single-project`,
                    { projectId },
                    {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }
                );
                if(projectResponse.data.success){
                    setProject(projectResponse.data.project);
                } else {
                    if(projectResponse.data.success){
                        setProject(projectResponse.data.project);
                    } else {
                        setErrorMessage(projectResponse.data.message);
                    }
                }
            } catch (error) {
                if (error.response.status === 403) {
                    alert("You do not have permission to access this project");
                    navigate("/user/my-projects");
                } else {
                    console.error('Error while loading project:', error);
                    setErrorMessage("Error while loading project");
                }
            }
        };

        fetchProject();
    }, [projectId, navigate]);

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (!project) {
        return <div>Loading...</div>;
    }


    return (
        <div className={styles.container}>
            <h1>{project.basicInfo.projectName} Dashboard</h1>
        </div>
    );
}

export default DashboardforActiveProject;
