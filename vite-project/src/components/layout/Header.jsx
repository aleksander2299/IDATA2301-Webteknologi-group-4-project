import { Link } from 'react-router-dom';
import '../../styles/main.css';

function Header() {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 1rem', 
      height: '5rem',
      width: '100%',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Stay Finder on the left */}
      <Link to="/">
        <button className="home-buttons">
          <b>Stay Finder</b>
        </button>
      </Link>

      {/* Container for buttons on the right */}
      <div className="right-buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/login">
          <button className="home-buttons right-button">
            <b>Log In</b>
          </button>
        </Link>

        {/* Add a third button */}
        <Link to="/register">
          <button className="home-buttons right-button">
            <b>Sign Up</b>
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
