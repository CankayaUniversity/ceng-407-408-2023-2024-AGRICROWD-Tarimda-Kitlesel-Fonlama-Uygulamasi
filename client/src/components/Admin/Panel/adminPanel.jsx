import React, { useState } from "react";
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import ChangePassword from "../changePassword/changePsw";
import CategoriesCrud from "../categories/categoriesCrud";
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

    const handleLogout = () => {
        Cookies.remove('admToken');
        navigate('/admin/login');
    };

    const renderPage = () => {
        switch (currentPage) {
            case "change-password":
                return <ChangePassword />;
            case "home":
                return <div>Hoşgeldiniz</div>;
            case "categories": // Yeni eklendi
                return <CategoriesCrud />;
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
                            Ana Sayfa
                        </Button>
                        <Button variant="light" className={`nav-link ${currentPage === 'change-password' ? 'active' : ''}`} onClick={handleChangePassword}>
                            Şifrenizi Değiştirin
                        </Button>
                        <Button variant="light" className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`} onClick={handleCategories}> {/* Yeni eklendi */}
                            Kategoriler
                        </Button>
                        <Button variant="light" className="nav-link" onClick={handleLogout}>
                            Çıkış Yap
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
