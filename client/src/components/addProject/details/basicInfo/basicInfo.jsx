import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './basicInfo.css';
import MapContainer from './Mapping/MapContainer';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const BasicInfoForm = () => {
  const [userId, setUserID] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [country, setCountry] = useState('Turkey');
  const [projectImages, setProjectImages] = useState([]);
  const [targetAmount, setTargetAmount] = useState('');
  const [campaignDuration, setCampaignDuration] = useState('');
  const [requiresLocation, setRequiresLocation] = useState(false); // Konum bilgisi istenmesi flag'i
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const authTokenFromCookie = Cookies.get('authToken');
    const fetchUserID = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3001/api/auth',
          {},
          {
            headers: {
              Authorization: `Bearer ${authTokenFromCookie}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
        if (response.data.user) {
          setUserID(response.data.user._id);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    if (category && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.categoryName === category);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories.map(subCat => subCat.subCategoryName));
        setRequiresLocation(selectedCategory.requiresLocation);
      }
    }
  }, [category, categories]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(userId));
    if (savedData) {
      setProjectName(savedData.projectName);
      setProjectDescription(savedData.projectDescription);
      setCategory(savedData.category);
      setSubCategory(savedData.subCategory);
      setCountry(savedData.country);
      setProjectImages(savedData.projectImages);
      setTargetAmount(savedData.targetAmount);
      setCampaignDuration(savedData.campaignDuration);
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (targetAmount <= 0) {
      alert('Hedef miktar pozitif bir değer olmalıdır.');
      return;
    }

    const validFileExtensions = /\.(jpg|jpeg|png|gif|bmp)$/i;
    let validFiles = true;
    Array.from(projectImages).forEach(file => {
      if (!validFileExtensions.test(file.name)) {
        validFiles = false;
      }
    });

    if (!validFiles) {
      alert('Dosya formatı desteklenmiyor. Lütfen yalnızca resim ve görüntü dosyaları yükleyin.');
      return;
    }

    const basicInfo = {
      projectName,
      projectDescription,
      category,
      subCategory,
      country,
      projectImages: Array.from(projectImages),
      targetAmount,
      campaignDuration,
    };

    try {
      localStorage.setItem(userId, JSON.stringify(basicInfo));
      localStorage.setItem("isBasicsCompleted", "true");
      navigate('/add-project/reward');
      console.log('Basic info submitted successfully!');
    } catch (error) {
      console.error('Error submitting basic info:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };


  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Project Name:</label>
          <input type="text" className="form-control" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Project Description:</label>
          <textarea className="form-control" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>
        {category && (
          <div className="mb-3">
            <label className="form-label">Sub-Category:</label>
            <select className="form-select" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
              <option value="">Select Sub-Category</option>
              {subCategories.map((subCat) => (
                <option key={subCat._id} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Country (Currently only Turkiye is available!):</label>
          <select className="form-select" value={country} onChange={(e) => setCountry(e.target.value)} required>
            <option value="turkey">Türkiye</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Project Images:</label>
          <input type="file" className="form-control" multiple onChange={(e) => setProjectImages(e.target.files)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Target Amount (Turkish Lira ₺):</label>
          <input type="number" className="form-control" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required min="1" />
        </div>
        <div className="mb-3">
          <label className="form-label">Campaign Duration (Days):</label>
          <input type="text" className="form-control" value={campaignDuration} onChange={(e) => setCampaignDuration(e.target.value)} required min="1" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <div className="map-section">
          {requiresLocation && (
            <div className="mb-3">
              <p>Emir gerekli konum alma islemlerini gerceklestirecek!</p>
              <MapContainer></MapContainer>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BasicInfoForm;
