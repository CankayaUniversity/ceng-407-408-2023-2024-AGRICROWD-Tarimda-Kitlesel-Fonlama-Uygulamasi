import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";

import ProtectedRoute from "./components/routes/protectedRoute";
import ProtectedAdminRoute from "./components/routes/protectedAdminRoute";
import NotFound from "./components/NotFound/NotFound";

import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";

//User
import UserSettings from "./components/User/AccountSettings/Personalinformation/Personalinformation";
import UserNavBar from "./components/User/UserNavBar/UserNavBar";
import UserHome from "./components/User/Home/UserHome";
import ChangePassword from "./components/User/AccountSettings/ChangePassword/ChangePassword";
import ActiveProjects from "./components/User/MyProjects/ActiveProjects/ActiveProjects";
import InactiveProjects from "./components/User/MyProjects/InactiveProjects/InactiveProjects";
import DashboardforActiveProject from "./components/User/MyProjects/ActiveProjects/DashboardforActiveProject/DashboardforActiveProject";
import MyInvestments from "./components/User/MyInvestments/MyInvestments";

//ProjectAddition
import AddProjectNav from "./components/addProject/ProgressBar/ProgressBar";
import AddProjects from "./components/addProject/AddProject";
import ProjectInform from "./components/addProject/details/inform/Inform";
import ProjectBasics from "./components/addProject/details/basicInfo/BasicInfo";
import ProjectReward from "./components/addProject/details/reward/Reward";
import ProjectSubmitForApproval from "./components/addProject/details/Submit/SubmitForApproval";

import AdminLogin from "./components/Admin/Login/AdminLogin";
import AdminHome from "./components/Admin/Panel/AdminHome/AdminHome";
import AdminNavBar from "./components/Admin/Panel/Navbar/AdminNavbar";
import AdminCategories from "./components/Admin/Panel/Categories/Categories";
import AdminChangePsw from "./components/Admin/Panel/ChangePassword/ChangePassword";
import AdminPendingProjects from "./components/Admin/Panel/PendingProjects/PendingProjects";

//Projects
import Projects from "./components/Projects/ApprovedProjects/Projects";
import ProjectDetail from "./components/Projects/ProjectDetail/ProjectDetail";

import styles from "./App.module.css";
const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const authTokenFromCookie = Cookies.get("authToken");
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
    Cookies.remove("authToken");
    setAuthToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="*"
          element={
            <>
              <Navbar isAuthenticated={authToken} onLogout={logout} />
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" exact element={<Home />} />
                <Route
                  path="/user/*"
                  element={
                    <ProtectedRoute>
                      <div className={styles.userPanelContainer}>
                        <UserNavBar />
                        <diV className={styles.userContainerRightContainer}>
                          <Routes>
                            <Route path="*" element={<NotFound />} />
                            <Route
                              path="account-settings"
                              element={<UserSettings />}
                            />
                            <Route path="home" element={<UserHome />} />
                            <Route
                              path="change-password"
                              element={<ChangePassword />}
                            />
                            <Route
                              path="my-projects"
                              element={<ActiveProjects />}
                            />
                            <Route
                              path="my-projects/*"
                              element={
                                <Routes>
                                  <Route path="*" element={<NotFound />} />
                                  <Route
                                    path="inactive"
                                    element={<InactiveProjects />}
                                  />
                                  <Route
                                    path=":projectNameandID/dashboard"
                                    element={<DashboardforActiveProject />}
                                  />
                                </Routes>
                              }
                            />
                            <Route
                              path="my-investments"
                              element={<MyInvestments />}
                            />
                          </Routes>
                        </diV>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route path="/projects" exact element={<Projects />} />
                <Route
                  path="/projects/:categoryNameandId"
                  element={<Projects />}
                />
                <Route
                  path="/project/:projectNameandId"
                  element={<ProjectDetail />}
                />
                <Route path="/logout" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          }
        />

        <Route
          path="/add-project/*"
          element={
            <AddProjects>
              <ProtectedRoute>
                <Routes>
                  <Route path="*" element={<NotFound />} />
                  <Route path="inform" element={<ProjectInform />} />
                  <Route path="basics" element={<ProjectBasics />} />
                  <Route path="reward" element={<ProjectReward />} />
                  <Route path="submit" element={<ProjectSubmitForApproval />} />
                </Routes>
              </ProtectedRoute>
            </AddProjects>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminNavBar />
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="change-password" element={<AdminChangePsw />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route
                  path="pending-projects"
                  element={<AdminPendingProjects />}
                />
              </Routes>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
