import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function AdminHome() {
    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Welcome to Admin Panel</Card.Title>
                            <Card.Text>
                                This is the home page for admin.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminHome;
