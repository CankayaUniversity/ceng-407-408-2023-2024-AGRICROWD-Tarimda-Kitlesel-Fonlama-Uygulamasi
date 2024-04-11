import React from 'react';
import './NotFound.css'; 

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="error-text">
        <h1>404</h1>
        <h3>Oops! Page not found</h3>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <a href="/" className="btn btn-primary">Go Back to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
