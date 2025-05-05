import { Link } from 'react-router-dom';


import mainStyle from '../../styles/main.module.css';


function Header() {
    return (

        <header>
            <Link to={'/'} >
                <button className={mainStyle["home-buttons"]}>
                    <b>Stay Finder</b>
                </button>
            </Link>
        </header>

    );
}

export default Header;