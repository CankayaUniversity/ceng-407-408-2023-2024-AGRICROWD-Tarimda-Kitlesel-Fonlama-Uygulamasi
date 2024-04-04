import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/projects/pending');
        const projectsWithUserDetails = await Promise.all(response.data.map(async project => {
          const userResponse = await axios.post('http://localhost:3001/api/info/user', { userId: project.userId });
          const userDetails = userResponse.data;
          return { ...project, userDetails };
        }));
        setProjects(projectsWithUserDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleApproveProject = async () => {
    // Proje onaylama işlemleri
  };

  const handleRejectProject = async () => {
    // Proje reddetme işlemleri
  };

  const renderProjectData = (projectData) => {
    return (
      <div>
        <p><strong>Project Name:</strong> {projectData.projectName}</p>
        <p><strong>Project Description:</strong> {projectData.projectDescription}</p>
        <p><strong>Category:</strong> {projectData.category}</p>
        <p><strong>Subcategory:</strong> {projectData.subCategory}</p>
        <p><strong>Country:</strong> {projectData.country}</p>
        <p><strong>Target Amount:</strong> {projectData.targetAmount}</p>
        <p><strong>Campaign Duration:</strong> {projectData.campaignDuration} days</p>
      </div>
    );
  };

  const renderUserDetails = (userDetails) => {
    return (
      <div>
        <p><strong>User Name:</strong> {userDetails.name}</p>
        <p><strong>User Email:</strong> {userDetails.email}</p>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Pending Projects</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {projects.map(project => (
            <div key={project._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  {renderProjectData(project.basicInfo)}
                  <div className="mt-3">
                    <h5>User Details:</h5>
                    {renderUserDetails(project.userDetails)}
                    <button className="btn btn-success mr-2" onClick={() => handleApproveProject(project._id)}>Approve</button>
                    <button className="btn btn-danger" onClick={() => handleRejectProject(project._id)}>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingProjects;
