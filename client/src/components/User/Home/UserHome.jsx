import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Cookies modülünü ekliyoruz
import { Helmet } from 'react-helmet-async';
import styles from './UserHome.module.css'; 

const UserHome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = Cookies.get('authToken'); // Cookies'den auth token'i alıyoruz
        if (!authToken) {
          console.error('Auth token not found.');
          return;
        }

        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/auth`, {}, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          console.error('Kullanıcı bilgileri alınamadı.');
        }
      } catch (error) {
        console.error('Sunucuyla iletişim hatası:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className={styles.homeContainer}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>User Home - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/user/home" />
      </Helmet>
      <h1>Welcome to Your Dashboard, {user ? user.name : 'User'}</h1>
      <p>Here you can manage your projects, account settings, and more.</p>
    </div>
  );
};

export default UserHome;
