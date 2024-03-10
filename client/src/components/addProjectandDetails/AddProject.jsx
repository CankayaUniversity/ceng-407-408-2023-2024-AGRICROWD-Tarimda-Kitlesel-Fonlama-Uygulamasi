// AddProject.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import BasicInfoForm from './basicInfo';
import axios from 'axios';

import "./addProject.css";

const AddProject = () => {
  const { userId, projectId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:3001/check-session');
        if (response.data.success) {
          // Kullanıcı giriş yapmış, devam et
        } else {
          // Kullanıcı giriş yapmamış, yönlendir
          console.log('Session check failed:', response.data.errors);
          // Uygun bir hata mesajı göster veya kullanıcıyı /login sayfasına yönlendir
          navigate('/login');
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Axios hatası, kullanıcıyı /login sayfasına yönlendir
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

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
          element={currentStep === 1 ? <BasicInfoForm userId={userId} projectId={projectId} onSubmit={handleBasicInfoSubmit} /> : <Navigate to={`/add-project/${userId}`} />}
        />
        {/* Diğer aşamaları da ekleyebilirsiniz */}
      </Routes>
    </div>
  );
};

export default AddProject;
