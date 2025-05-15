import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import '../../styles/main.css';
import './SearchPage.css';

import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import HotelCard from "../../components/HotelCard/HotelCard.tsx";
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';

import { navigateToRoomDetails, parseURLDate, formatDateForURL, CommonSearchCriteria, navigateToSearch } from '../../utils/navigationUtils';

// Interface for rooms/hotels can be expanded however make sure or null is used if you do since this is supposed to be used for multiple functions
interface Hotel {
    id: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
}

function SearchPage() {

    // Needs to be destructured to be able to be changed
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // State to hold the dates selected by the picker
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

    // Just to store all hotels however not to be changed only used to filter
    const [allHotels, setAllHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Changed to allow null as well
    const [searchTerm, setsearchTerm] = useState<string | null>(() => searchParams.get('searchTerm') || '');
    const [fromDate, setFromDate] = useState<string | null>(() => parseURLDate(searchParams.get('from')));
    const [toDate, setToDate] = useState<string | null>(() => parseURLDate(searchParams.get('to')));
    const [roomTypeInput, setRoomTypeInput] = useState<string>(() => searchParams.get('roomType') || 'any');

    //Only run once to create the main list
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log("SearchPage: Fetching all hotels...");
        //Get all hotels
        axios.get('"http://localhost:8080/api/rooms');

    }, []);

    //Run to get filtered hotels to display hotelcards
    useEffect(() => {
        console.log("SearchPage: URL params changed or allHotels updated. Filtering...");

        // Update initial values for SearchBar based on current URL
        setInitialSearchTerm(searchParams.get('searchTerm') || '');
        setInitialStartDate(parseURLDate(searchParams.get('from')));
        setInitialEndDate(parseURLDate(searchParams.get('to')));
        setInitialRoomType(searchParams.get('roomType') || 'any');



    }, [searchParams, allHotels, isLoading, error]); // Re-run when URL params change OR when allHotels data arrives






    // UseEffect to react to changes like user navigating backward
    useEffect(() => {
        // Load values after change to website
        const hotelNameParam = searchParams.get('hotelName');
        const locationParam = searchParams.get('location');
        const fromParam = parseURLDate(searchParams.get('from'));
        const toParam = parseURLDate(searchParams.get('to'));

        // Set initial values to datepicker
        setCheckInDate(fromParam);
        setCheckOutDate(toParam);

        // Save the new variables
        setHotelName(hotelNameParam);
        setLocation(locationParam);
        setFromDate(fromParam);
        setToDate(toParam);

        {/* Here we will filter based on the data */
        }

    }, [searchParams]); // Set to only run when searchParams gets changed


    const handleSearchFromBar = (criteria: SearchBarCriteria) => {
        console.log('SearchPage received search from SearchBar:', criteria);
        navigateToSearch(navigate, {
            searchTerm: criteria.searchTerm,
            startDate: criteria.startDate,
            endDate: criteria.endDate,
            roomType: criteria.roomType
        });
    };

    const GoToDealHandler = (hotelId: string) => {
        navigateToRoomDetails(navigate, hotelId, initialStartDate, initialEndDate);
    };

    return (
        <div>
            <Header/>
            <main>
                {/* Search Bar Section temporary until function is made */}
                <section className="container search-section" style={{marginTop: '20px'}}>
                    <div className="searchbarbox">
                        <form className="search-field">
                            <label htmlFor="SearchLocation">Search for hotel/location</label>
                            <input type="search" name="SearchLocation" id="SearchLocation"/>
                        </form>

                        {/* Select dropdown for Room Type */}
                        <div className="select-wrapper">
                            <label htmlFor="roomType">Room Type</label>
                            <select id="roomType"
                                    className="search-select"> {/* Use a different class than search-btn */}
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                                <option value="family">Family</option>
                            </select>
                        </div>

                        {/* Input for Number of Rooms */}
                        <form className="numberOfRooms">
                            <label htmlFor="number">Number of rooms</label>
                            <input type="number" name="number" id="number" min="1"/>
                        </form>
                        {/* Place the date picker component here */}
                        <div style={{ display: 'flex', alignItems: 'center' }}> {/* Optional wrapper for layout */}
                             <CustomDatePicker
                                 onDatesSelected={handleDatesUpdate} // Pass the handler function
                                 initialStartDate={checkInDate}      // Pass the current state
                                 initialEndDate={checkOutDate}        // Pass the current state
                            />
                        </div>
                        {/* Search Button */}
                        <button className="search-btn active">Search</button>
                    </div>
                </section>

                {/* Filters Section */}
                <div className="filters">
                    <button className="filter-btn">Sort by (rating, low to high...)</button>
                    <button className="filter-btn">Price</button>
                    <button className="filter-btn">Filter by rooms</button>
                    <button className="filter-btn">Rating</button>
                    <button className="filter-btn">Hotel or house</button>
                </div>

                {/* Hotel List Section */}
                <div className="hotel-list">
                    {hotels.length > 0 ? (
                        hotels.map((hotel) => (
                                <HotelCard
                                    key={hotel.id}
                                    id={hotel.id}
                                    imageUrl={hotel.imageUrl}
                                    imageAlt={`Image of ${hotel.name}`}
                                    title={hotel.name}
                                    description={hotel.description}
                                >
                                    {/* Using buttons as children was an idea given by AI since i could not figure out how to use different buttons depending on the page while they were still connected */}
                                    <button
                                        className="deal-btn"
                                        onClick={() => {
                                            GoToDealHandler(hotel.id)
                                        }}
                                    >
                                        Go to Deal
                                    </button>
                                    {/* Different buttons depending on page */}
                                </HotelCard>
                            )
                        )
                    ) : (
                        // If empty TODO: However it doesnt get empty yet even if the data is empty
                        <p className="no-results-message">No hotels found matching your criteria.</p>
                    )
                    }
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default SearchPage;