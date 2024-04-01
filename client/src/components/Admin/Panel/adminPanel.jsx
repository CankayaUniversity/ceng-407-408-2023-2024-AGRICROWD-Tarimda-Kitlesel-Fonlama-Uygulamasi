import React, { useState } from "react";
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import ChangePassword from "../changePassword/changePsw";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
    const [currentPage, setCurrentPage] = useState("home"); // Başlangıçta "home" sayfasını göstermek için
    const navigate = useNavigate();

    const handleChangePassword = () => {
        setCurrentPage("change-password");
    };

    const handleLogout = () => {
        // Çıkış işlemi: admToken'ı sil ve kullanıcıyı giriş sayfasına yönlendir
        Cookies.remove('admToken');
        navigate('/admin/login');
    };

    const renderPage = () => {
        switch (currentPage) {
            case "change-password":
                return <ChangePassword />;
            case "home":
                return <div>Hoşgeldiniz</div>; // Ana sayfa içeriği
            default:
                return null;
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={3}>
                    <Nav className="flex-column">
                        <Button variant="light" className="nav-link" onClick={() => setCurrentPage("home")}>
                            Ana Sayfa
                        </Button>
                        <Button variant="light" className="nav-link" onClick={handleChangePassword}>
                            Şifrenizi Değiştirin
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
