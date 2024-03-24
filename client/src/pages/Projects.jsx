import Card from '../components/Card';

function Projects() {
  return (
    <div
      style={{
        margin: '4rem 0',
      }}
    >
      <h2 style={{ fontSize: '2.8rem', marginBottom: '2rem' }}>Fundraising</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
        }}
      >
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>
    </div>
  );
}

export default Projects;
