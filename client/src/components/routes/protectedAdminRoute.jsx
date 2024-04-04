import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProtectedAdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAdminAuth = async () => {
            const admToken = Cookies.get('admToken');
            if (!admToken) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.post(
                    'http://localhost:3001/api/admin/verify-token',
                    { token: admToken },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setIsAdminAuthenticated(true);
                }
            } catch (error) {
                console.error('Authentication error:', error);
            } finally {
                setLoading(false);
            }
        };

        verifyAdminAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default ProtectedAdminRoute;
