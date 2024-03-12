import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import BasicInfoForm from './basicInfo';


import "./addProject.css";

const AddProject = () => {
  const { userId, projectId } = useParams(123,456);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleBasicInfoSubmit = () => {
    setCurrentStep(2);
  };

  return (
    <div>
      <nav className='subNav'>
        <ul>
          <li className={currentStep === 1 ? 'active' : ''}>
            <Link to={`/add-project/${userId}/${projectId}/basic`} className={currentStep === 1 ? 'active-link' : ''}>
              Add Basics
            </Link>
          </li>
          <li className={currentStep === 2 ? 'active' : ''}>
            <Link to={`/add-project/${userId}/${projectId}/reward`} className={currentStep === 2 ? 'active-link' : ''}>
              Add Rewards
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route
          path="basic"
          element={currentStep === 1 ? <BasicInfoForm userId={userId} projectId={projectId} onSubmit={handleBasicInfoSubmit} /> : <Navigate to={`/add-project/${userId}`} />}
        />
      </Routes>
    </div>
  );
};

export default AddProject;
