import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Projects from './pages/Projects';
import ProjectCreationPage from './pages/ProjectCreationPage';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

const navbarButtonsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1.5rem',
  gap: '4rem',
};

function Main({ children }) {
  return <div className='main'>{children}</div>;
}

function App() {
  return (
    <div>
      <Navbar>
        <nav style={navbarButtonsStyle}>
          <p>Projects</p>
          <p>Whitepaper</p>
          <p>Login</p>
          <p
            style={{
              border: '2px solid hsla(186, 33%, 94%, 1)',
              borderRadius: '100px',
              padding: '6px 10px',
            }}
          >
            Sign in
          </p>
        </nav>
      </Navbar>
      <Main>
        {/* <Login></Login> */}
        {/* <SignUp></SignUp> */}
        {/* <Hero></Hero> */}
        <ProjectCreationPage></ProjectCreationPage>
      </Main>
    </div>
  );
}

export default App;
