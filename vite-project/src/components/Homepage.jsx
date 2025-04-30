import '../styles/homepagestyle.css';
import '../styles/main.css';


import amsterdamImg from '../Images/Amsterdam placeholder.jpg';
import bergenImg from '../Images/Bergen placeholder.jpg';
import mainRoomImg from '../Images/main page room placeholder.jpg';
import osloImg from '../Images/Oslo placeholder.jpg';
import aalesundImg from '../Images/Ålesund placeholder.jpg';
import Footer from './Footer.jsx';
import Header from './Header.jsx';


function HomePage() {
    return (
      <div>
        <Header />
        <main style={{ marginTop: '20px' }}>
          <section className="container">
            <div className="introductionbox">
              <div className="introductiontext">Welcome to Stay Finder! Find your dream stay today!</div>
            </div>
          </section>
  
          <section className="container" style={{ marginTop: '20px' }}>
            <div className="backgroundbox">
              <img src={mainRoomImg} alt="Room placeholder" />
              <div className="searchbarcontainer">
                <button className="button1">Search for hotel or location!</button>
                <button className="button1">Room type?</button>
                <button className="button2">How many?</button>
                <button className="button3">Search</button>
              </div>
            </div>
          </section>
  
          <section className="popular-section" style={{ marginTop: '20px' }}>
            <div className="popular-title-box">
              <div className="popular-title">Popular places to visit!</div>
            </div>
  
            <div className="recommend-container">
              <div className="recommendbox">
                <img src={aalesundImg} alt="Ålesund" />
                <div className="placebox">Ålesund</div>
              </div>
              <div className="recommendbox">
                <img src={osloImg} alt="Oslo" />
                <div className="placebox">Oslo</div>
              </div>
              <div className="recommendbox">
                <img src={bergenImg} alt="Bergen" />
                <div className="placebox">Bergen</div>
              </div>
              <div className="recommendbox">
                <img src={amsterdamImg} alt="Amsterdam" />
                <div className="placebox">Amsterdam</div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

export default HomePage;
