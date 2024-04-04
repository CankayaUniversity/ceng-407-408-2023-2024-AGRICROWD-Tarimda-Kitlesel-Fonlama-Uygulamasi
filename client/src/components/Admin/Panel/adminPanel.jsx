import React, { useState } from "react";
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import ChangePassword from "./changePassword/changePsw";
import CategoriesCrud from "./categories/categoriesCrud";
import PendingProjects from "./pendingProjects/pendingProjects";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
    const [currentPage, setCurrentPage] = useState("home");
    const navigate = useNavigate();

    const handleChangePassword = () => {
        setCurrentPage("change-password");
    };

    const handleCategories = () => { 
        setCurrentPage("categories");
    };

    const handlePendingProjects = () => {
        setCurrentPage("pending-projects");
    };

    const handleLogout = () => {
        Cookies.remove('admToken');
        navigate('/admin/login');
    };

    const renderPage = () => {
        switch (currentPage) {
            case "change-password":
                return <ChangePassword />;
            case "home":
                return <div>Welcome</div>;
            case "categories":
                return <CategoriesCrud />;
            case "pending-projects": 
                return <PendingProjects />;
            default:
                return null;
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={3}>
                    <Nav className="flex-column">
                        <Button variant="light" className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage("home")}>
                            Home
                        </Button>
                        <Button variant="light" className={`nav-link ${currentPage === 'change-password' ? 'active' : ''}`} onClick={handleChangePassword}>
                            Change Password
                        </Button>
                        <Button variant="light" className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`} onClick={handleCategories}>
                            Categories
                        </Button>
                        <Button variant="light" className={`nav-link ${currentPage === 'pending-projects' ? 'active' : ''}`} onClick={handlePendingProjects}>
                            Pending Projects
                        </Button>
                        <Button variant="light" className="nav-link" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Col>
                <Col md={9}>
                    {renderPage()}
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPanel;
