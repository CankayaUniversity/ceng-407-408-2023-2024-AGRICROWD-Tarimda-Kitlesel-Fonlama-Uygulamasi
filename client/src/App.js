// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddProject from "./components/addProjectandDetails/AddProject";
import BasicInfoForm from "./components/addProjectandDetails/basicInfo";
import Signup from './components/login_register/Signup';
import Login from './components/login_register/Login';
import UserPanel from './components/login_register/userPanel';
import MainNavbar from './components/navBar/navBar';
import Home from './components/Home/home';



const App = () => {
  const userId = "001";
  const projectId = "001";
  
  return (
    <Router>
      <MainNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="/user-panel" element={<UserPanel />} />
        <Route path="/add-project/:userId" element={<AddProject />} />
        <Route path="/add-project/:userId/:projectId/basic" element={<BasicInfoForm />} />
      </Routes>
    </Router>
  );
};

export default App;
