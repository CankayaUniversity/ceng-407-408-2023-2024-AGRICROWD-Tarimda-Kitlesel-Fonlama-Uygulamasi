import React, { useState, useEffect } from 'react';

const ProjectCreationPage = ({ onSubmit }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [country, setCountry] = useState('Turkey');
  const [projectImages, setProjectImages] = useState([]);
  const [targetAmount, setTargetAmount] = useState('');
  const [campaignDuration, setCampaignDuration] = useState('');

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const categoryData = [
      {
        title: 'Sustainable Agriculture Projects',
        subCategories: [
          'Organic farming practices',
          'Agricultural technologies enhancing productivity',
        ],
      },
      {
        title: 'Water Resources and Irrigation Projects',
        subCategories: [
          'Improvement of irrigation systems',
          'Projects promoting water conservation',
        ],
      },
      {
        title: 'Agricultural Technology and Innovation',
        subCategories: [
          'Smart agricultural technologies',
          'Agricultural robots and automation',
        ],
      },
      {
        title: 'Plant Breeding and Genetics',
        subCategories: [
          'Development of high-yielding and resilient crops',
          'Projects for conserving biodiversity',
        ],
      },
      {
        title: 'Agricultural Education and Awareness',
        subCategories: [
          'Education programs for farmers',
          'Projects aimed at raising awareness of agriculture in society',
        ],
      },
      {
        title: 'Local Agricultural Initiatives',
        subCategories: [
          'Support programs for small-scale farmers',
          'Projects promoting local agricultural products',
        ],
      },
      {
        title: 'Climate Change Adaptation Projects',
        subCategories: [
          'Agricultural projects for climate change adaptation',
          'Projects encouraging eco-friendly farming practices',
        ],
      },
      {
        title: 'Agricultural Product Marketing',
        subCategories: [
          'Support projects for marketing and distribution of local products',
          'Projects enabling agricultural products to reach wider markets',
        ],
      },
    ];

    const mainCategories = categoryData.map((cat) => cat.title);
    const allSubCategories = categoryData.reduce((acc, cat) => {
      acc[cat.title] = cat.subCategories;
      return acc;
    }, {});

    setCategories(mainCategories);
    setSubCategories(allSubCategories);
    setAllCategories(categoryData);
  }, []);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setSubCategory('');
  };

  const handleSubmit = (e) => {
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
      projectImages,
      targetAmount,
      campaignDuration,
    };
    onSubmit(basicInfo);
  };

  const formContainerStyle = {
    marginTop: '2rem',
    padding: '4rem 8rem 8rem',
    backgroundColor: 'hsla(0, 0%, 100%, 0.01)',
    border: '2px solid hsla(0, 0%, 100%, 0.7)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignSelf: 'start',
    fontSize: '1.25rem',
  };

  const inputStyle = {
    width: '24rem',
    height: '4rem',
    borderRadius: '12px',
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#f1f3f5',
  };

  const buttonStyle = {
    borderRadius: '12px',
    fontSize: '1.8rem',
    height: '4rem',
    width: '%100',
    cursor: 'pointer',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#343a40',
    gridColumn: '1 / span 2',
    marginTop: '2rem',
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={{ marginBottom: '4rem', fontSize: '2rem', fontWeight: '400' }}>
        Create New Project for Funding
      </h2>
      <form onSubmit={handleSubmit} style={gridStyle}>
        <label style={labelStyle}>
          Project Name
          <input
            type='text'
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            style={inputStyle}
            placeholder='Project Name'
          />
        </label>
        <label style={labelStyle}>
          Project Description
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Category
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={inputStyle}
          >
            <option value=''>Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        {category && (
          <label style={labelStyle}>
            Sub-Category
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              style={inputStyle}
            >
              <option value=''>Select Sub-Category</option>
              {subCategories[category] &&
                subCategories[category].map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))}
            </select>
          </label>
        )}
        <label style={labelStyle}>
          Country
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={inputStyle}
          >
            <option value='turkey'>
              Turkey (*currently only Turkey is available)
            </option>
          </select>
        </label>
        <label style={labelStyle}>
          Project Images
          <input
            type='file'
            multiple
            onChange={(e) => setProjectImages(e.target.files)}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Target Amount (₺)
          <input
            type='number'
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            min='1'
            style={inputStyle}
            placeholder='20000₺'
          />
        </label>
        <label style={labelStyle}>
          Campaign Duration
          <input
            type='text'
            value={campaignDuration}
            onChange={(e) => setCampaignDuration(e.target.value)}
            required
            min='1'
            style={inputStyle}
            placeholder='Days'
          />
        </label>
        <button type='submit' style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProjectCreationPage;
