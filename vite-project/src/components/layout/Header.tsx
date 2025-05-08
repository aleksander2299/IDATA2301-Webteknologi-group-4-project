import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/main.css';


function Header() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
    console.log(storedRole);  
  }, []);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };
  
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
      {/* Site Logo */}
      <Link to="/">
        <button className="home-buttons">
          <b>Stay Finder</b>
        </button>
      </Link>

      {/* Container for buttons on the right */}
      <div className="right-buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {role && (
          <b className="header-text">Hello {role}</b>
        )}
        {role == 'USER' && (
          <>
          { /* favorites page */}
          <Link to="/favorites">
          <button className="home-buttons right-button">
            <b>Favorites</b>
          </button>
          </Link>
          </>
        )
        }

        {role == 'ADMIN' && (
          <>
          { /* Admin page */}
          <Link to="/admin">
          <button className="home-buttons right-button">
            <b>Admin Page</b>
          </button>
          </Link>
          </>
        )
        }

        {role == 'PROVIDER' && (
          <>
          <b>hello</b>
          </>
        )
        }

        {!role && (
          <>
          { /* Log in button */ }
          <Link to="/login">
            <button className="home-buttons right-button">
              <b>Log In</b>
            </button>
          </Link>

          {/* Sign up button */}
          <Link to="/register">
            <button className="home-buttons right-button">
              <b>Sign Up</b>
            </button>
          </Link>
          </>
        )}

        {role && (
          <>
          {/* Log out button */}
            <button className="home-buttons right-button" onClick={handleLogout}>
              <b>Log Out</b>
            </button>
          </>
        )
        }
        
      </div>
    </header>
  );
}

export default Header;
