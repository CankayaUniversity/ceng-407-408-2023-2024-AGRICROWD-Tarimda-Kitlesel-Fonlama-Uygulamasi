const heroButtonStyle = {
  fontSize: '1.6rem',
  padding: '12px 28px',
  cursor: 'pointer',
  textAlign: 'center',
  color: 'black',
  backgroundColor: '#fff',
  marginTop: '0.5rem',
  borderRadius: '100px',
};

const heroContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '18rem',
};

const heroTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  color: '#343a40',
};

const heroHeaderStyle = {
  fontSize: '4rem',
};

const heroSpanStyle = {
  fontSize: '2rem',
};

function Hero() {
  return (
    <div style={heroContainerStyle}>
      <div style={heroTextStyle}>
        <h2 style={heroHeaderStyle}>
          The #1 Crowd Funding <br></br>Platform <br></br>in
          <span style={{ color: '#f4f636' }}>the World</span>
        </h2>
        <span style={heroSpanStyle}>
          Cultivating the Future of Agriculture:<br></br>
          <span>Where Investment, Innovation, and Soil Unite!</span>
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button style={heroButtonStyle}>Discover Projects</button>
          <button style={heroButtonStyle}>Create Account</button>
        </div>
      </div>
      <img src='images/flowers.svg' width='400' style={{}} alt='Hero Svg' />
    </div>
  );
}

export default Hero;
