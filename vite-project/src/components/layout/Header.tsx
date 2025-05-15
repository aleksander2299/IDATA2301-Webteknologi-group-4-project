import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/main.css';

import HamburgerIcon from '../../assets/burgerIcon.svg?react';
import CrossIcon from '../../assets/crossIcon.svg?react';


function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown state
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
          <b className="header-text">Hello {localStorage.getItem('username')}</b>
        )}
        {role == 'ROLE_USER' && (
          <>
          { /* favourites page */}
          <Link to="/favourites">
          <button className="home-buttons right-button">
            <b>Favourites</b>
          </button>
          </Link>
          { /* settings page */ }
          <Link to="/settings">
          <button className="home-buttons right-button">
            <b>Settings</b>
          </button>
          </Link>
          </>
        )
        }

        {role == 'ROLE_ADMIN' && (
          <>
          { /* Admin page */ }
          <Link to="/admin">
          <button className="home-buttons right-button">
            <b>Admin Page</b>
          </button>
          </Link>
          </>
        )
        }

        {role == 'ROLE_PROVIDER' && (
          <>
          { /* Provider page */ }
          <Link to="/provider">
            <button className="home-buttons right-button">
              <b>Provider Page</b>
            </button>
          </Link>
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

        { /* Dropdown bar */ }
        <div className="dropdown" style={{ position: 'relative' }}>
          <button
            className="home-buttons right-button"
            onClick={toggleDropdown}
            style={{ background: 'transparent', border: 'none' }}
          >
            {/* Conditionally render SVGs based on dropdown state */}
            {isDropdownOpen ? (
              <CrossIcon width="40" height="40" />
            ) : (
              <HamburgerIcon width="50" height="50" />
            )}
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: '0' }}>
          {role == 'ROLE_USER' && (
          <>
          { /* favourites page */}
          <Link to="/favourites" className="dropdown-link">
            Favourites
          </Link>
          { /* settings page */ }
          <Link to="/settings" className="dropdown-link">
            Settings
          </Link>
          </>
        )
        }
        {role == 'ROLE_ADMIN' && (
          <>
          { /* Admin page */}
          <Link to="/admin" className="dropdown-link">
            Admin Page
          </Link>
          </>
        )
        }

        {role == 'ROLE_PROVIDER' && (
          <>
            { /* Provider page */ }
            <Link to="/provider" className="dropdown-link">
              Provider Page
            </Link>
          </>
        )
        }

        {!role && (
          <>
          { /* Log in button */ }
          <Link to="/login" className="dropdown-link">
              Log In
          </Link>

          {/* Sign up button */}
          <Link to="/register" className="dropdown-link">
              Sign Up
          </Link>
          </>
        )}

        {role && (
          <>
          {/* Log out button */}
            <option className="dropdown-link" onClick={handleLogout}>
              <b>Log Out</b>
            </option>
          </>
        )
        }
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
