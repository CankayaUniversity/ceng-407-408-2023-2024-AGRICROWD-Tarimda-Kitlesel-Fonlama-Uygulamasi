import Logo from './Logo';

function Navbar({ children }) {
  return (
    <header style={{ padding: '2rem 0' }}>
      <div className='nav-bar'>
        <Logo></Logo>
        {children}
      </div>
    </header>
  );
}

export default Navbar;
