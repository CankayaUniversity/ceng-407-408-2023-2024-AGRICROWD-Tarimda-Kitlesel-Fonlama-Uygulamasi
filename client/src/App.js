import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/home';
import Signup from './components/login_register/Signup';
import Login from './components/login_register/Login';
import UserPanel from './components/login_register/userPanel';
import AddProject from './components/addProjectandDetails/AddProject';
import MainNavbar from './components/navBar/navBar';
import ProtectedRoute from './components/routes/protectedRoute';
import ProtectedAdminRoute from './components/routes/protectedAdminRoute';
import AdminLogin from './components/Admin/Login/adminLogin';
import AdminHome from './components/Admin/Panel/home/home';
import AdminNavBar from './components/Admin/Panel/adminNavBar';
import AdminCategories from './components/Admin/Panel/categories/categoriesCrud';
import AdminChangePsw from './components/Admin/Panel/changePassword/changePsw';
import AdmingPendingProjects from './components/Admin/Panel/pendingProjects/pendingProjects';
import Cookies from 'js-cookie';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const authTokenFromCookie = Cookies.get('authToken');
      if (authTokenFromCookie) {
        setAuthToken(authTokenFromCookie);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const logout = () => {
    Cookies.remove('authToken');
    setAuthToken(null);
  };

  return (
    <Router>
      <MainNavbar isAuthenticated={authToken} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/panel" element={
          <ProtectedRoute>
            <UserPanel />
          </ProtectedRoute>
        }
        />
        <Route path="/add-project" element={
          <ProtectedRoute>
            <AddProject />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/home" element={
          <ProtectedAdminRoute>
            <AdminNavBar />
            <AdminHome />
          </ProtectedAdminRoute>
        }
        />
        <Route path="/admin/change-password" element={
          <ProtectedAdminRoute>
            <AdminNavBar />
            <AdminChangePsw />
          </ProtectedAdminRoute>
        }
        />
        <Route path="/admin/categories" element={
          <ProtectedAdminRoute>
            <AdminNavBar />
            <AdminCategories />
          </ProtectedAdminRoute>
        }
        />
        <Route path="/admin/pending-projects" element={
          <ProtectedAdminRoute>
            <AdminNavBar />
            <AdmingPendingProjects />
          </ProtectedAdminRoute>
        }
        />
        <Route path="/admin/pending-projects" element={
          <ProtectedAdminRoute>
            <AdminNavBar />
            <AdmingPendingProjects />
          </ProtectedAdminRoute>
        }
        />
        <Route path='/logout' element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;