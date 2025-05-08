import '../../styles/main.css';

function Footer() {
    return (
        <footer>
          <div className="footer-text">
            &copy;{new Date().getFullYear()} Stay Finder
          </div>
        </footer>
    );
}

export default Footer;