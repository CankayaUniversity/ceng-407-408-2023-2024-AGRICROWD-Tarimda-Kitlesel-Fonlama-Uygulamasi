import React from 'react';
import { Helmet } from 'react-helmet-async';

import styles from './MyInvestments.module.css';

const MyInvestments = () => {
    return (
        <div className={styles.homeContainer}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>My Investments - AGRICROWD</title>
                <link rel="canonical" href="http://localhost:3000/user/my-investments" />
            </Helmet>
            <h1>My Investments</h1>
            <p>Here you can manage your investments, and more.</p>
        </div>
    );
};

export default MyInvestments;