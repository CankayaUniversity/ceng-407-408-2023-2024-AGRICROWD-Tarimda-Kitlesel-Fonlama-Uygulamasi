import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function UserPanel() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    gender: '',
    age: '',
    phone: '',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('user'));
    if (storedUserInfo) {
      setUserInfo(prev => ({ ...prev, ...storedUserInfo }));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/updateUser', userInfo)
      .then(response => {
        console.log('Kullanıcı bilgileri güncellendi', response);
        localStorage.removeItem('user'); // Kullanıcı bilgilerini localStorage'dan temizle
        navigate('/login'); // Kullanıcıyı login sayfasına yönlendir
      })
      .catch(error => {
        console.error('Bir hata oluştu', error);
      });
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">İsim</label>
          <input type="text" className="form-control" id="name" name="name" value={userInfo.name} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={userInfo.email} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="country" className="form-label">Ülke</label>
          <input type="text" className="form-control" id="country" name="country" value={userInfo.country} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">Şehir</label>
          <input type="text" className="form-control" id="city" name="city" value={userInfo.city} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Cinsiyet</label>
          <select className="form-select" id="gender" name="gender" value={userInfo.gender} onChange={handleChange}>
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Yaş</label>
          <input type="number" className="form-control" id="age" name="age" value={userInfo.age} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Telefon</label>
          <input type="text" className="form-control" id="phone" name="phone" value={userInfo.phone} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Bilgileri Güncelle</button>
      </form>
    </div>
  );
}

export default UserPanel;
