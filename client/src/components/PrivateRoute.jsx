import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const authToken = Cookies.get('authToken');
      const sessionId = Cookies.get('sessionID');

      try {
        const response = await axios.post('http://localhost:3001/verify-auth', { authToken, sessionId });
        
        if (response.data.success) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  return authenticated ? <Route {...rest} element={element} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
