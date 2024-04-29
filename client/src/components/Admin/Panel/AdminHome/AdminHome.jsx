import React from 'react';
import styles from './AdminHome.module.css';

function AdminHome() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Admin Panel!</h1>
      <div>
        <p>
          You can manage your users and projects in system using navigation bar
        </p>
      </div>
    </div>
  );
}

export default AdminHome;
