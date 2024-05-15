import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './InactiveProjects.module.css';

function InactiveProjects() {
    const [projects, setProjects] = useState([]);

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
                    `http://localhost:3001/api/user/projects/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${authToken}` }
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

    const calculateRemainingDays = (approvalDate, campaignDuration) => {
        const endDate = new Date(approvalDate);
        endDate.setDate(endDate.getDate() + parseInt(campaignDuration));
        const now = new Date();
        const difference = endDate - now;
        const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return daysLeft > 0 ? daysLeft : 0;
    };

    return (
        <div className={styles.container}>
            <h1>My Approved Projects</h1>
            {projects.length > 0 ? (
                projects.map((project, index) => (
                    (project.status === 'expired' || project.status === 'pending') && (
                        <div className={styles.projectCard}>
                            {projectCardContents(project, calculateRemainingDays)}
                        </div>
                    )
                ))
            ) : (
                <p>No approved projects found.</p>
            )}
        </div>
    );
}

function projectCardContents(project, calculateRemainingDays) {
    return (
        <>
            <h2 className={styles.title}>{project.basicInfo.projectName}</h2>
            <p className={styles.info}>
                {project.basicInfo.category} -&gt; {project.basicInfo.subCategory}
            </p>
            <p className={styles.info}>Country: {project.basicInfo.country}</p>
            <p className={styles.info}>Campaign Duration: {project.basicInfo.campaignDuration} days</p>
            <p className={styles.info}>Target Amount: {project.basicInfo.targetAmount}</p>
            <p className={styles.info}>Status: {project.status}</p>
            {project.status === 'approved' && (
                <>
                    <p className={styles.info}>
                        Approval Date:{" "}
                        {new Date(project.approvalDate).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                    <p className={styles.info}>Days Remaining: {calculateRemainingDays(project.approvalDate, project.basicInfo.campaignDuration)}</p>
                </>
            )}
            {project.status === 'expired' && (
                <p className={styles.info}>Expired: {project.expirationDate}</p>
            )}
            {project.status === 'pending' && (
                <p className={styles.info}>Project is under review by our team. You will be contacted soon.</p>
            )}
            {project.status === 'rejected' && (
                <p className={styles.rejectionReason}>Rejection Reason: {project.rejectionReason}</p>
            )}
            {project.basicInfo.projectImages && project.basicInfo.projectImages.length > 0 ? (
                <div className={styles.projectImagesContainer}>
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
            ) : (
                <div className={styles.noPhotos}>No photos available for this project!</div>
            )}
        </>
    );
}

export default InactiveProjects;
