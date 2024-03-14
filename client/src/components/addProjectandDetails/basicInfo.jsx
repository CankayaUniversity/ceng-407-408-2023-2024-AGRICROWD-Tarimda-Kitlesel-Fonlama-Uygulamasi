import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
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
  const [subCategories, setSubCategories] = useState({});
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const categoryData = [
      {
        title: 'Sürdürülebilir Tarım Projeleri',
        subCategories: ['Organik tarım uygulamaları', 'Verimliliği artıran tarım teknolojileri'],
      },
      {
        title: 'Su Kaynakları ve Sulama Projeleri',
        subCategories: ['Sulama sistemlerinin iyileştirilmesi', 'Su tasarrufu sağlayan projeler'],
      },
      {
        title: 'Tarım Teknolojisi ve İnovasyon',
        subCategories: ['Akıllı tarım teknolojileri', 'Tarım robotları ve otomasyon'],
      },
      {
        title: 'Bitki Islahı ve Genetik',
        subCategories: ['Yüksek verimli ve dirençli bitkilerin geliştirilmesi', 'Biyoçeşitliliği koruma projeleri'],
      },
      {
        title: 'Tarım Eğitimi ve Bilincin Artırılması',
        subCategories: ['Çiftçilere yönelik eğitim programları', 'Toplumda tarım bilincini artırmaya yönelik projeler'],
      },
      {
        title: 'Yerel Tarım Girişimleri',
        subCategories: ['Küçük ölçekli çiftçilere destek programları', 'Yerel tarım ürünlerini tanıtma projeleri'],
      },
      {
        title: 'İklim Değişikliği ile Başa Çıkma Projeleri',
        subCategories: ['İklim değişikliği adaptasyonu için tarım projeleri', 'Çevre dostu tarım uygulamalarını teşvik eden projeler'],
      },
      {
        title: 'Tarım Ürünleri Pazarlaması',
        subCategories: ['Yerel ürünlerin pazarlaması ve dağıtımı için destek projeler', 'Tarım ürünlerinin daha geniş bir pazara ulaşmasını sağlayan projeler'],
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

  const navigate = useNavigate();
  const { userId, projectId } = useParams();

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
    navigate(`/add-project/${userId}/${projectId}/reward`);
  };

  return (
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
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>
      {category && (
        <label>
          Sub-Category:
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
            <option value="">Select Sub-Category</option>
            {subCategories[category] && subCategories[category].map((subCat) => (
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
  );
};

export default BasicInfoForm;
