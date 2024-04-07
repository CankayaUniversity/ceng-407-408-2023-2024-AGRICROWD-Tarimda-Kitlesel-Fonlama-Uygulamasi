import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import BasicInfoForm from './details/basicInfo/basicInfo';
import RewardsForm from './details/reward/Reward';

import "./addProject.css";

const AddProject = () => {
  const [userId, setUserId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [basicInfoCompleted, setBasicInfoCompleted] = useState(false);
  const [rewardsCompleted, setRewardsCompleted] = useState(true); // Adil reward bölümünü tasarlayana kadar otomatik olarak true kalacak
  const [submitDisabled, setSubmitDisabled] = useState(true); 
  const [submitMessage, setSubmitMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const authToken = Cookies.get('authToken');
        const response = await axios.post('http://localhost:3001/api/auth', { authToken });
        if (response.data.success) {
          setUserId(response.data.user._id);
          setLoading(false);
        } else {
          window.alert("Giriş yapma hatası lütfen tekrardan giris yapiniz!");
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    }
    checkAuth();
  }, [navigate]); 

  useEffect(() => {
    if (basicInfoCompleted && rewardsCompleted) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [basicInfoCompleted, rewardsCompleted]);

  const handleBasicInfoSubmit = (basicInfo) => {
    setCurrentStep(2);
    setBasicInfoCompleted(true);
  };

  const handleRewardsSubmit = () => {
    setRewardsCompleted(true);
  };

  const handleApprovalSubmit = async () => {
    try {
      const basicInfo = JSON.parse(localStorage.getItem(userId));
      const response = await axios.post('http://localhost:3001/api/admin/projects/add-pending', {
        userId,
        basicInfo
      });
      setSubmitMessage(response.data.message);
      setTimeout(() => {
        setSubmitMessage('');
      }, 15000);
      localStorage.removeItem(userId);
    } catch (error) {
      console.error('Error submitting project for approval:', error);
      setSubmitMessage('Bir hata oluştu, lütfen tekrar deneyin.'); 
    }
  };

  return (
    <div className="container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <ul className='navbar-nav mr-auto'>
              <li className={currentStep === 1 ? 'nav-item active' : 'nav-item'}>
                <button className="btn nav-link" onClick={() => setCurrentStep(1)}>Add Basic</button>
              </li>
              <li className={currentStep === 2 ? 'nav-item active' : 'nav-item'}>
                <button className="btn nav-link" onClick={() => setCurrentStep(2)}>Add Reward</button>
              </li>
              <li className='nav-item'>
                <button className={`btn nav-link ${submitDisabled ? 'disabled' : ''}`} onClick={handleApprovalSubmit} disabled={submitDisabled}>Submit for Approval</button>
              </li>
            </ul>
          </nav>

          {submitMessage && (
            <div className="alert alert-info" role="alert">
              {submitMessage}
            </div>
          )}

          {currentStep === 1 && (
            <BasicInfoForm userId={userId} onSubmit={handleBasicInfoSubmit} />
          )}

          {currentStep === 2 && (
            <RewardsForm onSubmit={handleRewardsSubmit} />
          )}
        </>
      )}
    </div>
  );
};

export default AddProject;
