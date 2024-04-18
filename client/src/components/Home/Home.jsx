import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.module.css';

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
    <section></section>
  </>
);

export default Home;
