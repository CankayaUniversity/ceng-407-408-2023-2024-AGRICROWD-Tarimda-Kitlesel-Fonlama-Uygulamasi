import React from 'react';
import { Helmet } from 'react-helmet-async';

import styles from './UserHome.module.css'; 

const UserHome = () => {
  return (
    <div className={styles.homeContainer}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>User Home - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/user/home" />
      </Helmet>
      <h1>Welcome to Your Dashboard</h1>
      <p>Here you can manage your projects, account settings, and more.</p>
    </div>
  );
};

export default UserHome;
