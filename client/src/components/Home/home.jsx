import React from 'react';
import { Link } from 'react-router-dom';

import './home.css';

const Home = () => (
  <div className='home-container'>
    <header>
      <h1>Welcome to AgriCROWD Platform!</h1>
      <p>Your hub for agricultural projects and collaboration.</p>
    </header>
    <section className='cta-section'>
      <p>Ready to get started?</p>
      <Link to="/add-project" className="cta-button">Add Your Project</Link>
    </section>
  </div>
);

export default Home;
