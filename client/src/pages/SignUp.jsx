const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  width: '36rem',
  height: '40rem',

  backgroundColor: 'hsla(0, 0%, 100%, 0.01)',
  border: '2px solid hsla(0, 0%, 100%, 0.7)',
  backdropFilter: 'blur(16px)',
  borderRadius: '16px',
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyle = {
  alignSelf: 'start',
  fontSize: '1.8rem',
};

const inputStyle = {
  width: '24rem',
  height: '4rem',
  borderRadius: '12px',
  padding: '8px 16px',
  border: 'none',
  backgroundColor: '#f1f3f5',
};

const buttonStyle = {
  borderRadius: '12px',
  fontSize: '1.8rem',
  width: '24rem',
  height: '4rem',
  cursor: 'pointer',
  textAlign: 'center',
  color: 'white',
  backgroundColor: '#343a40',
  marginTop: '1rem',
};

function SignUp() {
  return (
    <form style={formContainerStyle}>
      <h1 style={{ color: '#343a40' }}>Sign Up</h1>

      <div style={inputContainerStyle}>
        <label style={labelStyle}>Name</label>
        <input type='text' style={inputStyle} placeholder='Name'></input>
      </div>

      <div style={inputContainerStyle}>
        <label style={labelStyle}>Email</label>
        <input type='text' style={inputStyle} placeholder='Email'></input>
      </div>

      <div style={inputContainerStyle}>
        <label style={labelStyle}>Password</label>
        <input type='text' style={inputStyle} placeholder='Password'></input>
      </div>

      <button style={buttonStyle}>Create Account</button>
    </form>
  );
}

export default SignUp;
