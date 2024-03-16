import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const authTokenFromCookie = Cookies.get('authToken');

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:3001/api/auth',
                    { authToken: authTokenFromCookie },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    console.log('User is authenticated');
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Authentication error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authTokenFromCookie) {
            verifyAuth();
        } else {
            setLoading(false);
        }
    }, [authTokenFromCookie]);

    if (loading) {
        return null;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
