import { Link } from 'react-router-dom';

import '../../styles/main.css';


function Header() {
    return (

        <header>
            <Link to={'/'} >
                <button className="home-buttons">
                    <b>Stay Finder</b>
                </button>
            </Link>
        </header>

    );
}

export default Header;