import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import "./inform.css";

const Inform = ({ onInformComplete }) => { // Inform bileşenine onInformComplete props'unu ekle
    const [isAgreed, setIsAgreed] = useState(false);
    const [canToggleCheckbox, setCanToggleCheckbox] = useState(false);
    const [canProceed, setCanProceed] = useState(false);
    const [checkboxRemainingTime, setCheckboxRemainingTime] = useState(20);
    const [proceedRemainingTime, setProceedRemainingTime] = useState(15);
    const navigate = useNavigate();

    useEffect(() => {
        const checkboxTimer = setTimeout(() => {
            setCanToggleCheckbox(true);
        }, 20000); 

        const checkboxInterval = setInterval(() => {
            setCheckboxRemainingTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        // Temizleme
        return () => {
            clearTimeout(checkboxTimer);
            clearInterval(checkboxInterval);
        };
    }, []);

    useEffect(() => {
        if (isAgreed) {
            const proceedTimer = setTimeout(() => {
                setCanProceed(true);
            }, 15000);
    
            const proceedInterval = setInterval(() => {
                setProceedRemainingTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);
    
            return () => {
                clearTimeout(proceedTimer);
                clearInterval(proceedInterval);
            };
        }
    }, [isAgreed]);
    
    const handleAgree = () => {
        setIsAgreed(!isAgreed);
    };

    const handleSubmit = () => {
        navigate("/add-project/basics");
        onInformComplete();
    };

    return (
        <div className="inform-container container">
            <Card className="inform-card">
                <Card.Body className={isAgreed ? "agreed-content" : ""}>
                    {isAgreed ? (
                        <>
                            <Card.Title className="inform-header">Great! Now, let's take the next steps:</Card.Title>
                            <Card.Text className="inform-text agreed-list">
                                First, let's start by entering the basic details of your project. Think of it as introducing your project to the world!
                            </Card.Text>
                            <Card.Text className="inform-text agreed-list">
                                After that, it's time to decide how profits will be shared and distributed. Your contribution, your reward!
                            </Card.Text>
                            <Card.Text className="inform-text agreed-list">
                                Once everything is filled out accurately, just sit back and relax. Your project will be sent for approval by our administrator.
                            </Card.Text>
                            <Button variant="primary" onClick={handleSubmit} disabled={!canProceed}>
                                Proceed to Add Basic {canProceed ? "" : `(${proceedRemainingTime} seconds remaining)`}
                            </Button>
                        </>
                    ) : (
                        <>
                            <h2 className="inform-header">Welcome to Agricrowd!</h2>
                            <p className="inform-text">
                                First and foremost, we extend our gratitude for choosing our platform. Our mission is to lead initiatives that will enhance the quality and quantity of agricultural production or support innovations aimed at bolstering agricultural practices. It is our duty to provide equal service to both our investors and users seeking investment opportunities.
                            </p>
                            <p className="inform-text">
                                Through facilitating both donations and investments, Agricrowd prioritizes transparency by leveraging blockchain technology.
                            </p>
                            <p className="inform-text">
                                Agricrowd serves as a crowdfunding platform dedicated to agricultural projects of all kinds. While supporting both donations and investments, this platform leverages blockchain technology to ensure transparency. The aim is to foster transparency between investors and project owners.
                            </p>
                            <p className="inform-text">
                                Upon reaching the targeted investment or donation amount, projects come to fruition. In the event of success, investors receive profits distributed based on their contribution percentages. Hence, the recipient of the investment is obligated to document the processes and report the total amount acquired upon project completion.
                            </p>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label={canToggleCheckbox ? "I have read and agree to the above information." : `Please read for ${checkboxRemainingTime} seconds before ticking`}
                                        checked={isAgreed}
                                        onChange={canToggleCheckbox ? handleAgree : () => { }}
                                        key={isAgreed ? "agreed" : "notAgreed"}
                                        disabled={!canToggleCheckbox}
                                    />
                                </Form.Group>
                            </Form>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Inform;
