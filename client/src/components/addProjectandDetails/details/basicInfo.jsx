import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './basicInfo.css';

const BasicInfoForm = ({ onSubmit }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [country, setCountry] = useState('Turkey');
  const [projectImages, setProjectImages] = useState([]);
  const [targetAmount, setTargetAmount] = useState('');
  const [campaignDuration, setCampaignDuration] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);


  useEffect(() => {
    // Kategorileri API'den al
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
    if (category && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.categoryName === category);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories.map(subCat => subCat.subCategoryName));
      }
    }
  }, [category, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (targetAmount <= 0) {
      alert('Hedef miktar pozitif bir değer olmalıdır.');
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
      await onSubmit(basicInfo);
      console.log('Basic info submitted successfully!');
    } catch (error) {
      console.error('Error submitting basic info:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
        </label>
        <label>
          Project Description:
          <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required />
        </label>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </label>
        {category && (
          <label>
            Sub-Category:
            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
              <option value="">Select Sub-Category</option>
              {subCategories.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Country (Currently only Turkey is available!):
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="turkey">Türkiye</option>
          </select>
        </label>
        <label>
          Project Images:
          <input type="file" multiple onChange={(e) => setProjectImages(e.target.files)} />
        </label>
        <label>
          Target Amount (Turkish Lira ₺):
          <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required min="1" />
        </label>
        <label>
          Campaign Duration (Days):
          <input type="text" value={campaignDuration} onChange={(e) => setCampaignDuration(e.target.value)} required min="1" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BasicInfoForm;
