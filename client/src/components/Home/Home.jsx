import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import RandomProjects from './RandomProjects'; // Doğru yolu sağlayın
import styles from './Home.module.css';
import Footer from '../Footer/Footer';

const Home = () => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>AGRICROWD - Your hub for agricultural projects</title>
      <link rel="canonical" href="http://localhost:3000/" />
    </Helmet>
    <section
      className={styles.container}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/main-img.jpg)`,
      }}
    >
      <p className={styles.heroText}>
        <div>Your hub for agricultural</div>
        <div>projects and collaboration</div>
      </p>
      <p className={styles.subText}>Ready to get started?</p>
      <Link to='/add-project/inform'>
        <button className={styles.button}>Add Your Project</button>
      </Link>
    </section>
    <RandomProjects />
    <Footer />
  </>
);

export default Home;
