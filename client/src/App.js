import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import AddProject from "./components/addProjectandDetails/AddProject";
import BasicInfoForm from "./components/addProjectandDetails/basicInfo";
import Signup from './components/login_register/Signup';
import Login from './components/login_register/Login';
import UserPanel from './components/login_register/userPanel';
import MainNavbar from './components/navBar/navBar';
import Home from './components/Home/home';
import PrivateRoute from './components/PrivateRoute';
import Cookies from 'js-cookie';


const App = () => {
  const isAuthenticated = !!Cookies.get('authToken');
  return (
    <BrowserRouter>
      <MainNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route
          path="/add-project/:userId"
          element={<PrivateRoute element={<AddProject />} authenticated={isAuthenticated} />}
        />
        <Route
          path="/add-project/:userId/:projectId/basic"
          element={<PrivateRoute element={<BasicInfoForm />} authenticated={isAuthenticated} />}
        />
        <Route
          path="/user-panel/*"
          element={<PrivateRoute element={<UserPanel />} authenticated={isAuthenticated} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
