import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import ProgressBar from './ProgressBar/ProgressBar';
import styles from './AddProjects.module.css';

export default function AddProjects({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.leftContainer}>
        <Link to='/'>
          <Logo heading={false} />
        </Link>

        <div className={styles.navbarContainer}>
          <ProgressBar></ProgressBar>
        </div>
      </div>

      <div className={styles.rightContainer}>{children}</div>
    </div>
  );
}
