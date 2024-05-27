import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressBarFilled}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles.progressPercentage}>{progress.toFixed(1)}%</div>
    </div>
  );
};

export default ProgressBar;
