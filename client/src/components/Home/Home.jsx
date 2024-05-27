import React from 'react';
import { Link } from 'react-router-dom';
import RandomProjects from './RandomProjects'; // Doğru yolu sağlayın
import styles from './Home.module.css';
import Footer from '../Footer/Footer';

const Home = () => (
  <>
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
