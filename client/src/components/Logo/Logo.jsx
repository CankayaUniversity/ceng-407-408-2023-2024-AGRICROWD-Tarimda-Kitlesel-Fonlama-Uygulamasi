import styles from './Logo.module.css';

function Logo({ image = true, heading = true }) {
  return (
    <div className={styles.logo}>
      {image && (
        <img
          src='/images/logo.png'
          alt='Agricrowd Logo'
          width={36}
          height={36}
        />
      )}
      {heading && <h1 className={styles.text}>agricrowd</h1>}
    </div>
  );
}

export default Logo;
