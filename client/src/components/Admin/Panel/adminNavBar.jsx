import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function AdminNavBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('admToken');
        navigate('/admin/login');
        alert('You have successfully logged out.');
    };

    return (
        <Navbar bg="light" expand="md">
            <Navbar.Toggle aria-controls="admin-navbar-nav" />
            <Navbar.Collapse id="admin-navbar-nav">
                <Nav className="mr-auto">
                    <Button variant="light" as={Link} to="/admin/home" className={location.pathname === "/admin/home" ? 'active' : ''}>
                        Home
                    </Button>
                    <Button variant="light" as={Link} to="/admin/change-password" className={location.pathname === "/admin/change-password" ? 'active' : ''}>
                        Change Password
                    </Button>
                    <Button variant="light" as={Link} to="/admin/categories" className={location.pathname === "/admin/categories" ? 'active' : ''}>
                        Categories
                    </Button>
                    <Button variant="light" as={Link} to="/admin/pending-projects" className={location.pathname === "/admin/pending-projects" ? 'active' : ''}>
                        Pending Projects
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

export default AdminNavBar;
