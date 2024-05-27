import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import styles from './Inform.module.css';

const Inform = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [canToggleCheckbox, setCanToggleCheckbox] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [checkboxRemainingTime, setCheckboxRemainingTime] = useState(10);
  const [proceedRemainingTime, setProceedRemainingTime] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const isInformCompleted = localStorage.getItem('isInformCompleted');
    if (isInformCompleted === 'true') {
      navigate('/add-project/basics');
    } else {
      const checkboxTimer = setTimeout(() => {
        setCanToggleCheckbox(true);
      }, 10000);

      const checkboxInterval = setInterval(() => {
        setCheckboxRemainingTime((prevTime) =>
          prevTime > 0 ? prevTime - 1 : 0
        );
      }, 1000);

      return () => {
        clearTimeout(checkboxTimer);
        clearInterval(checkboxInterval);
      };
    }
  }, []);

  useEffect(() => {
    if (isAgreed) {
      const proceedTimer = setTimeout(() => {
        setCanProceed(true);
      }, 5000);

      const proceedInterval = setInterval(() => {
        setProceedRemainingTime((prevTime) =>
          prevTime > 0 ? prevTime - 1 : 0
        );
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
    localStorage.setItem('isInformCompleted', 'true');
    navigate('/add-project/basics');
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Adding a Project - What You Need to Know - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/add-project/inform" />
      </Helmet>
      <div className={styles.informCard}>
        <Card.Body className={isAgreed ? 'agreed-content' : ''}>
          {isAgreed ? (
            <>
              <h2 className={styles.sidebarTitle}>
                Great! Now, let's take the next steps:
              </h2>
              <p className={styles.subContent}>
                First, let's start by entering the basic details of your
                project. Think of it as introducing your project to the world!
              </p>
              <p className={styles.subContent}>
                After that, it's time to decide how profits will be shared and
                distributed. Your contribution, your reward!
              </p>
              <p className={styles.subContent}>
                Once everything is filled out accurately, just sit back and
                relax. Your project will be sent for approval by our
                administrator.
              </p>

              <div className={styles.buttonContainer}>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed}
                  className={styles.button}
                >
                  Proceed to Add Basic{' '}
                  {canProceed
                    ? ''
                    : `(${proceedRemainingTime} seconds remaining)`}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.sidebarTitle}>Bring your creative project to life!</h2>
              <p className={styles.content}>
                First and foremost, we extend our gratitude for choosing our
                platform. Our mission is to lead initiatives that will enhance
                the quality and quantity of agricultural production or support
                innovations aimed at bolstering agricultural practices. It is
                our duty to provide equal service to both our investors and
                users seeking investment opportunities.
              </p>

              <p className={styles.content}>
                Through facilitating both donations and investments, Agricrowd
                prioritizes transparency by leveraging blockchain technology.
              </p>

              <p className={styles.content}>
                Agricrowd serves as a crowdfunding platform dedicated to
                agricultural projects of all kinds. While supporting both
                donations and investments, this platform leverages blockchain
                technology to ensure transparency. The aim is to foster
                transparency between investors and project owners.
              </p>

              <p className={styles.content}>
                Upon reaching the targeted investment or donation amount,
                projects come to fruition. In the event of success, investors
                receive profits distributed based on their contribution
                percentages. Hence, the recipient of the investment is obligated
                to document the processes and report the total amount acquired
                upon project completion.
              </p>
              <Form>
                <Form.Group className='mb-3' controlId='formBasicCheckbox'>
                  <Form.Check
                    type='checkbox'
                    label={
                      canToggleCheckbox
                        ? 'I have read and agree to the above information.'
                        : `Please read for ${checkboxRemainingTime} seconds before ticking`
                    }
                    checked={isAgreed}
                    onChange={canToggleCheckbox ? handleAgree : () => {}}
                    key={isAgreed ? 'agreed' : 'notAgreed'}
                    disabled={!canToggleCheckbox}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Card.Body>
      </div>
    </div>
  );
};

export default Inform;
