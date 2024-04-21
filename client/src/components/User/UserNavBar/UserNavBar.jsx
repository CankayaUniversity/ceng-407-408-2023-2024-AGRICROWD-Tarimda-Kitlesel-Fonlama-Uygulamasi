import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import "./UserNavBar.module.css";

function UserNavBar() {
    const location = useLocation();

    const handleLogout = () => {
        Cookies.remove('authToken');  // Kullanıcı token'ını sil
        window.location = '/login';  
        alert('You have successfully logged out.');
    };

    return (
        <Navbar bg="light" expand="md">
            <Navbar.Toggle aria-controls="user-navbar-nav" />
            <Navbar.Collapse id="user-navbar-nav">
                <Nav className="mr-auto">
                    <Button variant="light" as={Link} to="/user/home" className={location.pathname === "/user/home" ? 'active' : ''}>
                        Home
                    </Button>
                    <Button variant="light" as={Link} to="/user/panel" className={location.pathname === "/user/panel" ? 'active' : ''}>
                        Account Settings
                    </Button>
                    <Button variant="light" as={Link} to="/user/change-password" className={location.pathname === "/user/change-password" ? 'active' : ''}>
                        Change Password
                    </Button>
                    <Button variant="light" as={Link} to="/user/my-projects" className={location.pathname === "/user/my-projects" ? 'active' : ''}>
                        My Projects
                    </Button>
                </Nav>
                <Nav>
                    <Button variant="light" onClick={handleLogout}>
                        Logout
                    </Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default UserNavBar;
