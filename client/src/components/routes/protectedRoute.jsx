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
                if (authTokenFromCookie) {
                    const response = await axios.post(
                        `${process.env.REACT_APP_BASE_API_URL}/api/auth`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${authTokenFromCookie}`,
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true
                        }
                    );
                    if (response.data.success) {
                        console.log('User is authenticated');
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error('Authentication error:', error);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [authTokenFromCookie]);

    if (loading) {
        return null;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
