import { useParams, useSearchParams } from 'react-router-dom';

import '../../styles/main.css';
import homePageStyle from './HomePage.module.css';


import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.jsx';
import amsterdamImg from '../../Images/Amsterdam placeholder.jpg';
import bergenImg from '../../Images/Bergen placeholder.jpg';
import mainRoomImg from '../../Images/main page room placeholder.jpg';
import osloImg from '../../Images/Oslo placeholder.jpg';
import aalesundImg from '../../Images/Ålesund placeholder.jpg';


function HomePage() {

    const navigate = useNavigate();
        {/* Using string | null since the user does not need to set a date */}
        function Search(name: string | null, fromDate: string | null, toDate: string | null): void {
            {/* Since fromDate and toDate, can now be null the need to be formatted and tested */}
            const formattedFrom = fromDate || '';
            const formattedTo = toDate || '';
            let url = `/room/${name}`;

            const queryParams: string[] = [];
            {/* Using encodeURIComponent() since it can encode & which allows multiple parameters in a query */}
            if (formattedFrom) {
                query.push(`from=${encodeURIComponent(formattedFrom)}`)
            }
            if (formattedTo) {
                query.push(`to=${encodeURIComponent(formattedTo)}`)
            }

            if (query > 0) {
                url += `?${query.join('&')}`;
            }
            navigate(url);
        }
    return (
      <div>
        <Header />
        <main style={{ marginTop: '20px' }}>
          <section className={homePageStyle.container}>
            <div className={homePageStyle.introductionbox}>
              <div className={homePageStyle.introductiontext}>Welcome to Stay Finder! Find your dream stay today!</div>
            </div>
          </section>
  
          <section className={homePageStyle.container} style={{ marginTop: '20px' }}>
            <div className={homePageStyle.backgroundbox}>
              <img src={mainRoomImg} alt="Room placeholder" />
              <div className={homePageStyle.searchbarcontainer}>
                <button className={homePageStyle.buttons1}>Search for hotel or location!</button>
                <button className={homePageStyle.buttons1}>Room type?</button>
                <button className={homePageStyle.buttons2}>How many?</button>
                <button className={homePageStyle.buttons3}>Search</button>
              </div>
            </div>
          </section>
  
          <section className={homePageStyle["popular-section"]} style={{ marginTop: '20px' }}>
            <div className={homePageStyle["popular-title-box"]}>
              <div className={homePageStyle["popular-title"]}>Popular places to visit!</div>
            </div>
  
            <div className={homePageStyle["recommend-container"]}>
              <div className={homePageStyle.recommendbox}>
                <img src={aalesundImg} alt="Ålesund" />
                <div className={homePageStyle.placebox}>Ålesund</div>
              </div>
              <div className={homePageStyle.recommendbox}>
                <img src={osloImg} alt="Oslo" />
                <div className={homePageStyle.placebox}>Oslo</div>
              </div>
              <div className={homePageStyle.recommendbox}>
                <img src={bergenImg} alt="Bergen" />
                <div className={homePageStyle.placebox}>Bergen</div>
              </div>
              <div className={homePageStyle.recommendbox}>
                <img src={amsterdamImg} alt="Amsterdam" />
                <div className={homePageStyle.placebox}>Amsterdam</div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

export default HomePage;
