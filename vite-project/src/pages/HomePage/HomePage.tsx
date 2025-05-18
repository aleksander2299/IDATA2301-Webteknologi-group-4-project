import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/main.css';
// @ts-ignore
import homePageStyle from './HomePage.module.css';

import SearchBar from '../../components/SearchBar/SearchBar.tsx';
//import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';

import { CommonSearchCriteria, navigateToSearch } from "../../utils/navigationUtils.ts";

// @ts-ignore
import amsterdamImg from '../../Images/Amsterdam placeholder.jpg';
// @ts-ignore
import bergenImg from '../../Images/Bergen placeholder.jpg';
// @ts-ignore
import mainRoomImg from '../../Images/main page room placeholder.jpg';
// @ts-ignore
import osloImg from '../../Images/Oslo placeholder.jpg';
// @ts-ignore
import aalesundImg from '../../Images/Ålesund placeholder.jpg';


function HomePage() {

    const navigate = useNavigate();
    // State to hold the dates selected by the picker
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [initialSearchTerm, setInitialSearchTerm] = useState(''); // Example
    const [initialRoomType, setInitialRoomType] = useState('any'); // Example

    const handleSearchFromBar = (criteria: CommonSearchCriteria) => {
        console.log('HomePage received search criteria from SearchBar:', criteria);

        const searchCriteriaForNavigation: CommonSearchCriteria = {
            searchTerm: criteria.searchTerm,
            startDate: criteria.startDate,
            endDate: criteria.endDate,
            roomType: criteria.roomType,
        };
        navigateToSearch(navigate, searchCriteriaForNavigation);
    };




        // TEMPORARY TO SEE IF YOU ARE LOGGED IN.
        const username = localStorage.getItem('username');
        console.log('Logged in as:', username);

    return (
      <div>
        <Header />
        
        <main className={homePageStyle["content-wrapper"]}style={{ marginTop: '20px' }}>
          <section className={homePageStyle.container}>
            <div className={homePageStyle.introductionbox}>
              <div className={homePageStyle.introductiontext}>Welcome to Stay Finder! Find your dream stay today!</div>
            </div>
          </section>
  
          <section className={homePageStyle.container} style={{ marginTop: '20px' }}>
            <div className={homePageStyle.backgroundbox}>
              <img src={mainRoomImg} alt="Room placeholder" />
                <SearchBar
                    onSearch={handleSearchFromBar}
                    initialSearchTerm={initialSearchTerm}
                    initialStartDate={checkInDate}
                    initialEndDate={checkOutDate}
                    initialRoomType={initialRoomType}
                    className={homePageStyle.searchbarcontainer}
                >
                </SearchBar>
              </div>
          </section>
  
          <section className={homePageStyle["popular-section"]} style={{ marginTop: '20px' }}>
            <div className={homePageStyle["popular-title-box"]}>
              <div className={homePageStyle["popular-title"]}>Popular places to visit!</div>
            </div>


            <div className={homePageStyle["recommend-container"]}>
              <button onClick={() => handleSearchFromBar({
                  searchTerm: "Ålesund",
                  startDate: checkInDate,
                  endDate: checkOutDate,
                  roomType: 'any'
              })} className={homePageStyle.recommendbox}>
                <img src={aalesundImg} alt="Ålesund" />
                <div className={homePageStyle.placebox}>Ålesund</div>
              </button>
              <button onClick={() => handleSearchFromBar({
                  searchTerm: "Oslo",
                  startDate: checkInDate,
                  endDate: checkOutDate,
                  roomType: 'any'
              })} className={homePageStyle.recommendbox}>
                <img src={osloImg} alt="Oslo" />
                <div className={homePageStyle.placebox}>Oslo</div>
              </button>
              <button onClick={() => handleSearchFromBar({
                  searchTerm: "Bergen",
                  startDate: checkInDate,
                  endDate: checkOutDate,
                  roomType: 'any'
              })} className={homePageStyle.recommendbox}>
                <img src={bergenImg} alt="Bergen" />
                <div className={homePageStyle.placebox}>Bergen</div>
              </button>
              <button onClick={() => handleSearchFromBar({
                  searchTerm: "Amsterdam",
                  startDate: checkInDate,
                  endDate: checkOutDate,
                  roomType: 'any'
              })} className={homePageStyle.recommendbox}>
                <img src={amsterdamImg} alt="Amsterdam" />
                <div className={homePageStyle.placebox}>Amsterdam</div>
              </button>
            </div>

          </section>
        </main>
        <Footer />
      </div>
    );
  }

export default HomePage;
