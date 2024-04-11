import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './pendingProjects.css'

const PendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedbackMessage("");
    }, 15000); 
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const handleApproveProject = async (projectId) => {
    try {
      await axios.put('http://localhost:3001/api/admin/projects/approve', { projectId });
      setFeedbackMessage("Project approved successfully!");
      fetchProjects(); 
    } catch (error) {
      console.error('Error approving project:', error);
      setFeedbackMessage("Error approving project. Please try again later.");
    }
  };

  const handleRejectProject = async () => {
    try {
      await axios.put('http://localhost:3001/api/admin/projects/reject', { projectId: selectedProjectId, rejectionReason });
      setRejectionReason("");
      setSelectedProjectId(null);
      setFeedbackMessage("Project rejected successfully!");
      fetchProjects(); 
    } catch (error) {
      console.error('Error rejecting project:', error);
      setFeedbackMessage("Error rejecting project. Please try again later.");
    }
  };

  const renderProjectData = (projectData) => {
    return (
      <div>
        <h5>Project Details:</h5>
        <ul className="list-group">
          <li className="list-group-item"><strong>Project Name:</strong> {projectData.projectName}</li>
          <li className="list-group-item"><strong>Project Description:</strong> {projectData.projectDescription}</li>
          <li className="list-group-item"><strong>Category:</strong> {projectData.category}</li>
          <li className="list-group-item"><strong>Subcategory:</strong> {projectData.subCategory}</li>
          <li className="list-group-item"><strong>Country:</strong> {projectData.country}</li>
          <li className="list-group-item"><strong>Target Amount:</strong> {projectData.targetAmount}</li>
          <li className="list-group-item"><strong>Campaign Duration:</strong> {projectData.campaignDuration} days</li>
        </ul>
      </div>
    );
  };

  const renderUserDetails = (userDetails) => {
    return (
      <div>
        <h5>User Details:</h5>
        <ul className="list-group">
          <li className="list-group-item"><strong>Name:</strong> {userDetails.name}</li>
          <li className="list-group-item"><strong>Email:</strong> {userDetails.email}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Pending Projects</h2>
      {feedbackMessage && <div className="alert alert-success">{feedbackMessage}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {projects.filter(project => project.status === "pending").map(project => (
            <div key={project._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  {renderProjectData(project.basicInfo)}
                  <div className="mt-3">
                    {renderUserDetails(project.userDetails)}
                    <button className="btn btn-success mr-2" onClick={() => handleApproveProject(project._id)}>Approve</button>
                    <button className="btn btn-danger" onClick={() => setSelectedProjectId(project._id)}>Reject</button>
                    {selectedProjectId === project._id && (
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Rejection Reason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleRejectProject}>Send</button>
                      </div>
                    )}
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
