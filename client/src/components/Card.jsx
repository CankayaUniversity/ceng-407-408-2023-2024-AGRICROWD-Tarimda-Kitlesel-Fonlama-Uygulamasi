function Card() {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        height: '40rem',
        width: '28rem',
        cursor: 'pointer',
      }}
    >
      <div>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
          <img
            src='/images/tomato.jpeg'
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0',
            }}
            alt='Tomato'
          />
        </div>
        <div style={{ padding: '8px' }}>
          <h2 style={{ margin: '1rem 0rem', fontSize: '2rem' }}>Antalya</h2>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
            Soilless Tomato Greenhouse
          </h3>
          <p style={{ marginBottom: '3rem', fontSize: '1.25rem' }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
            expedita dolore dolorum.
          </p>
          <p style={{ fontSize: '1.5rem', textAlign: 'end' }}>1.2ETH of 4ETH</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
