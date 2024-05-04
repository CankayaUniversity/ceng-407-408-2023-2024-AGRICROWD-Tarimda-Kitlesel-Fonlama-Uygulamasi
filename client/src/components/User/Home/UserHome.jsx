import React from 'react';
import styles from './UserHome.module.css'; 

const UserHome = () => {
  

  return (
    <div className={styles.homeContainer}>
      <h1>Welcome to Your Dashboard</h1>
      <p>Here you can manage your projects, account settings, and more.</p>
      
    </div>
  );
};

export default UserHome;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import styles from './UserHome.module.css';

// const UserHome = () => {
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const authToken = Cookies.get('authToken');
//       try {
//         const response = await axios.get('http://localhost:3001/api/user/info', {
//           headers: { Authorization: `Bearer ${authToken}` }
//         });
//         setUserName(response.data.name);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <div className={styles.homeContainer}>
//       <h1>Welcome, {userName}!</h1>
//       <p>Here you can manage your projects, account settings, and more.</p>
//     </div>
//   );
// };

// export default UserHome;