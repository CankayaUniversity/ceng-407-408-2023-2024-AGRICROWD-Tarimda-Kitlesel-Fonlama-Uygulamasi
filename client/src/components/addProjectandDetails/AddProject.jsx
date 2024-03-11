import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import BasicInfoForm from './basicInfo';
import axios from 'axios';

import "./addProject.css";

// ...

const AddProject = () => {
  const { userId, projectId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);  // Kullanıcı bilgisi
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/check-session/${userId}`);
        if (response.data.success) {
          setUser(response.data.user);  // Giriş yapmış kullanıcının bilgisini al
        } else {
          console.log('Session check failed:', response.data.errors);
          navigate('/login');
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Axios hatası, kullanıcıyı /login sayfasına yönlendir
        navigate('/login');
      }
    };

    checkSession();
  }, [userId, navigate]);

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
          {/* Diğer aşamaları da ekleyebilirsiniz */}
        </ul>
      </nav>

      <Routes>
        <Route
          path="basic"
          element={currentStep === 1 ? <BasicInfoForm user={user} projectId={projectId} onSubmit={handleBasicInfoSubmit} /> : <Navigate to={`/add-project/${userId}`} />}
        />
        {/* Diğer aşamaları da ekleyebilirsiniz */}
      </Routes>
    </div>
  );
};

export default AddProject;
