import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function AdminLogout() {
    const navigate = useNavigate();
    React.useEffect(() => {
        Cookies.remove('admToken');
        navigate('/admin/login');
        alert('You have successfully logged out.');
    }, [navigate]); 
    return null;
}

export default AdminLogout;
