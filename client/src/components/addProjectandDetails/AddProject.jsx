import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import BasicInfoForm from './basicInfo';
import axios from 'axios';
import Cookies from 'js-cookie';

import "./addProject.css";

const AddProject = () => {
  const [userId, setUserId] = useState('');
  const { projectId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const authToken = Cookies.get('authToken');
        const response = await axios.post('http://localhost:3001/api/auth', { authToken });
        if (response.data.success) {
          setUserId(response.data.userId);
          setLoading(false);
        } else {
          window.alert("giris yapma hatasi");
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    }
    checkAuth();
  }, []);

  const generateProjectId = () => {
    const tempProjectId = Math.floor(1000000000 + Math.random() * 9000000000);
    return tempProjectId.toString();
  };

  const handleBasicInfoSubmit = () => {
    setCurrentStep(2);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <nav className='subNav'>
            <ul>
              <li className={currentStep === 1 ? 'active' : ''}>
                <Link to={`/add-project/${userId}/${generateProjectId()}/basic`} className={currentStep === 1 ? 'active-link' : ''}>
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
        </>
      )}
    </div>
  );
};

export default AddProject;
