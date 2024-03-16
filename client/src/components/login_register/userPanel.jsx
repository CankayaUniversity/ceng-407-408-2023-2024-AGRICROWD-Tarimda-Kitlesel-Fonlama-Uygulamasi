import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function UserPanel() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("user-panel için istek!");
    const authToken = Cookies.get('authToken');
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/auth', { authToken });
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          console.error('Kullanıcı kimliği alınamadı.');
        }
      } catch (error) {
        console.error('Sunucuyla iletişim hatası:', error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Merhaba, {user.email}</h1>
    </div>
  );
}

export default UserPanel;
