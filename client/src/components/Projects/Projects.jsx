import Card from '../Card/Card';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <section className={styles.projectsSection}>
      <h2>Browse projects</h2>
      <div className={styles.pageLayout}>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>
    </section>
  );
}
