import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/projects/pending');
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleApproveProject = async (projectId) => {
    // Proje onaylama işlemleri
  };

  const handleRejectProject = async (projectId) => {
    // Proje reddetme işlemleri
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
                  <h5 className="card-title">{project.basicInfo.projectName}</h5>
                  <p className="card-text">{project.basicInfo.projectDescription}</p>
                  <div className="card-text">
                    <strong>User ID:</strong> {project.userId}<br />
                    <strong>User Name:</strong> {project.userDetails ? project.userDetails.name : 'N/A'}<br />
                    <strong>User Email:</strong> {project.userDetails ? project.userDetails.email : 'N/A'}<br />
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-success mr-2" onClick={() => handleApproveProject(project._id)}>Approve</button>
                    <button className="btn btn-danger" onClick={() => handleRejectProject(project._id)}>Reject</button>
                  </div>
                  <pre className="mt-3">{JSON.stringify(project.basicInfo, null, 2)}</pre>
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
