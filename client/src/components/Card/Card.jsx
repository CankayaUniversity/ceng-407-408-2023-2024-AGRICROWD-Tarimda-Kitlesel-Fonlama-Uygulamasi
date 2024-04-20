import styles from './Card.module.css';

export default function Card() {
  return (
    <div className={styles.cardLayout}>
      <div className={styles.imageContainer}>
        <img
          src='./images/card-1.jpg'
          alt='Project Img'
          className={styles.image}
        ></img>
      </div>

      <div className={styles.content}>
        <div>
          <h3 className={styles.heading}>Greenhouse Garden</h3>
          <div className={styles.locationContainer}>
            <div className={styles.location}>
              <img
                src='./images/location.svg'
                width={20}
                alt='Location Icon'
              ></img>
              <span>Antalya</span>
            </div>
          </div>
        </div>

        <div className={styles.progressBarContainer}>
          <progress className={styles.progressBar} value={0.75}></progress>
          <div className={styles.progressData}>
            <p className={styles.progressDataText}>10 ETH raised</p>
          </div>
        </div>
      </div>
    </div>
  );
}
