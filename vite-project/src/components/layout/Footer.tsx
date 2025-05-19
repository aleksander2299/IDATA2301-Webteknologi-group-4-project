import '../../styles/main.css';

function Footer() {
    return (
        <footer>
          <div className="footer-text">
            <section>
              &copy;{new Date().getFullYear()} Stay Finder
            </section>
            <section style={{ marginTop: '20px' }}>
              <h1>Legal Disclaimer</h1>
              This website is a result of a university group project, performed in the course IDATA2301
              Web technologies, at NTNU. All the information provided here is a result of imagination.
              Any resemblance with real companies or products is a coincidence.
              <br /> {/* Line break for the second part of the disclaimer */}
              All the provided material is free to use for non-commercial purposes.
            </section>
            <section style={{ marginTop: '20px' }}>
              <h1>Contact Us</h1>
              Phone number: +47 123 45 678
              <br />Email address: Stayfinder@example.com
              <br />Address: Langelandsvegen, 6010 Ålesund
            </section>
          </div>
        </footer>
    );
}

export default Footer;