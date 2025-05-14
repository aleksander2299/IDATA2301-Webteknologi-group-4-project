import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import '../../styles/main.css';
import './SearchPage.css';

import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import HotelCard from "../../components/HotelCard/HotelCard.tsx";
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';

interface Hotel {
    id: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
}

    // Being reused for now however is the same between pages that need it
    function formatDateForURL(date: Date | null): string | null {
        if (!date) return null;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function parseURLDate(dateString: string | null): Date | null {
        // Copied from internet, just tests if the URL date is an actual date following ISO standards
        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;
        const date = new Date(dateString);
        // getTime returns NaN if the time is invalid
        if (isNaN(date.getTime())) return null;
        return date;
    }

function SearchPage() {

    // State to hold the dates selected by the picker
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

    {/* Fake Temporary data its set up differently since it will display every hotelcard it gets, so its not every hotel */
    }
    const [hotels, setHotels] = useState<Hotel[]>([
        {
            id: '1', name: 'Hotel 1', location: 'Location 1',
            description: 'This hotel has a nice view', imageUrl: '/images/hotel-room-1.jpg'
        },
        {
            id: '2', name: 'Hotel 2', location: 'Location 2',
            description: 'This hotel has a nice  oceanside view', imageUrl: '/images/hotel-room-2.jpg'
        },
    ]);

    // Needs to be destructured to be able to be changed
    const [searchParams, setSearchParams] = useSearchParams();

    // Changed to allow null as well
    const [hotelName, setHotelName] = useState<string | null>(() => searchParams.get('hotelName'));
    const [location, setLocation] = useState<string | null>(() => searchParams.get('location'));
    const [fromDate, setFromDate] = useState<string | null>(() => parseURLDate(searchParams.get('from')));
    const [toDate, setToDate] = useState<string | null>(() => parseURLDate(searchParams.get('to')));


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

        // Used to update DatePicker on this page based on searchParams
        const handleDatesUpdate = (selected: { startDate: Date | null; endDate: Date | null }) => {
            setCheckInDate(selected.startDate);
            setCheckOutDate(selected.endDate);

            const currentParams = new URLSearchParams(searchParams.toString());
            const formattedStart = formatDateForURL(selected.startDate);
            const formattedEnd = formatDateForURL(selected.endDate);

            if (formattedStart) {
                currentParams.set('from', formattedStart);
            } else {
                currentParams.delete('from');
            }
            if (formattedEnd) {
                currentParams.set('to', formattedEnd);
            } else {
                currentParams.delete('to');
            }
            // Update URL. The useEffect will then react to this change.
            setSearchParams(currentParams, { replace: true }); // Using replace to avoid too many history entries
        };

    const navigate = useNavigate();
    {/* Using string | null since the user does not need to set a date */
    }

    function GoToDeal(id: string, fromDate: string | null, toDate: string | null): void {
        {/* Since fromDate and toDate, can now be null the need to be formatted and tested */
        }
        const formattedFrom = fromDate || '';
        const formattedTo = toDate || '';
        let url = `/room/${id}`;

        const queryParams: string[] = [];
        {/* Using encodeURIComponent() since it can encode & which allows multiple parameters in a query */
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
                                            const fromDateString = formatDateForURL(checkInDate);
                                            const toDateString = formatDateForURL(checkOutDate);
                                            GoToDeal(hotel.id, fromDateString, toDateString)
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