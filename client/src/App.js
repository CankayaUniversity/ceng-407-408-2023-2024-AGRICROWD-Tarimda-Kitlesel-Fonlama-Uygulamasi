import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddProject from './components/addProjectandDetails/AddProject';
import Signup from './components/login_register/Signup';
import Login from './components/login_register/Login';
import UserPanel from './components/login_register/userPanel';
import MainNavbar from './components/navBar/navBar';
import Home from './components/Home/home';
import ProtectedRoute from './components/routes/protectedRoute';
import Cookies from 'js-cookie';

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
        <Route path="/user-panel" element={
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
        <Route path='/logout' element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;