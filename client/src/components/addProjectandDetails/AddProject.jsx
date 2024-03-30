import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BasicInfoForm from './details/basicInfo';
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
    navigate(`/add-project/${projectId}/edit/basic`);
  };

  const handleInitializeCategories = async () => {
    try {
      await axios.post('http://localhost:3001/api/categories/init');
      console.log('Kategoriler başarıyla başlatıldı.');
    } catch (error) {
      console.error('Kategorileri başlatırken bir hata oluştu:', error);
    }
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
                <button className={currentStep === 1 ? 'active-link' : ''} onClick={handleBasicInfoSubmit}>
                  Add Basics
                </button>
              </li>
              <li className={currentStep === 2 ? 'active' : ''}>
                <button className={currentStep === 2 ? 'active-link' : ''} onClick={() => setCurrentStep(2)}>
                  Add Rewards
                </button>
              </li>
            </ul>
          </nav>

          <button onClick={handleInitializeCategories}>Initialize Categories --TEST ONLY---</button>

          {currentStep === 1 && (
            <BasicInfoForm userId={userId} projectId={projectId} onSubmit={handleBasicInfoSubmit} />
          )}
        </>
      )}
    </div>
  );
};

export default AddProject;
