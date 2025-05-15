import { useState} from 'react'
import { useNavigate } from 'react-router-dom';

import '../../styles/main.css';
// @ts-ignore
import homePageStyle from './HomePage.module.css';

import SearchBar, { SearchCriteria } from '../../components/SearchBar/SearchBar.tsx';
//import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';

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

    function formatDateForURL(date: Date | null): string | null {
        if (!date) return null;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    // This function is called BY SearchBar when its search button is clicked
    const handleSearch = (criteria: SearchCriteria) => {
        /* Since fromDate and toDate, can now be null the need to be formatted and tested */

        console.log('HomePage received search criteria:', criteria);

        const formattedFrom = formatDateForURL(criteria.startDate);
        const formattedTo = formatDateForURL(criteria.endDate);

        let url = `/search`;
        const queryParams: string[] = [];

        {/* Using encodeURIComponent() since it can encode & which allows multiple parameters in a query */
        }
        if (criteria.searchTerm) {
            queryParams.push(`hotelName=${encodeURIComponent(criteria.searchTerm)}`)
        }

        if (criteria.roomType && criteria.roomType !== 'any') {
            queryParams.push(`roomType=${encodeURIComponent(criteria.roomType)}`);
        }

        if (formattedFrom) {
            queryParams.push(`from=${encodeURIComponent(formattedFrom)}`)
        }

        if (formattedTo) {
            queryParams.push(`to=${encodeURIComponent(formattedTo)}`)
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }
        navigate(url);
    }

<<<<<<< Updated upstream
=======
    if (criteria.roomType && criteria.roomType !== 'any') {
        queryParams.push(`roomType=${encodeURIComponent(criteria.roomType)}`);
    }

    if (formattedFrom) {
        queryParams.push(`from=${encodeURIComponent(formattedFrom)}`)
    }

    if (formattedTo) {
        queryParams.push(`to=${encodeURIComponent(formattedTo)}`)
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
    }
    navigate(url);

>>>>>>> Stashed changes

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
              <SearchBar
                  onSearch={handleSearch}
                  initialSearchTerm={initialSearchTerm}
                  initialStartDate={checkInDate}
                  initialEndDate={checkOutDate}
                  initialRoomType={initialRoomType}
                  // className={homePageStyle.customSearchBarOnHomepage} // Optional for homepage specific tweaks
              >
              </SearchBar>
          </section>
  
          <section className={homePageStyle["popular-section"]} style={{ marginTop: '20px' }}>
            <div className={homePageStyle["popular-title-box"]}>
              <div className={homePageStyle["popular-title"]}>Popular places to visit!</div>
            </div>


            <div className={homePageStyle["recommend-container"]}>
              <button onClick={() => handleSearch({
                  searchTerm: "Ålesund",
                  startDate: checkInDate,
                  endDate: checkOutDate,
                  roomType: 'any'
              })} className={homePageStyle.recommendbox}>
                <img src={aalesundImg} alt="Ålesund" />
                <div className={homePageStyle.placebox}>Ålesund</div>
              </button>
              <button onClick={() => handleSearch({
                  searchTerm: "Oslo",
                  startDate: checkInDate,
                  endDate: checkOutDate,
                  roomType: 'any'
              })} className={homePageStyle.recommendbox}>
                <img src={osloImg} alt="Oslo" />
                <div className={homePageStyle.placebox}>Oslo</div>
              </button>
              <button onClick={() => handleSearch({
                  searchTerm: "Bergen",
                  startDate: checkInDate,
                  endDate: checkOutDate,
                  roomType: 'any'
              })} className={homePageStyle.recommendbox}>
                <img src={bergenImg} alt="Bergen" />
                <div className={homePageStyle.placebox}>Bergen</div>
              </button>
              <button onClick={() => handleSearch({
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
