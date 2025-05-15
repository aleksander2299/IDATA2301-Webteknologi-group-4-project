import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import '../../styles/main.css';
import SearchPageStyle from './SearchPage.module.css';

//import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import HotelCard from "../../components/HotelCard/HotelCard.tsx";
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';

import { navigateToRoomDetails, parseURLDate, formatDateForURL, CommonSearchCriteria, navigateToSearch } from '../../utils/navigationUtils';
import SearchBar from "../../components/SearchBar/SearchBar.tsx";
import axios from "axios";

// Interface for rooms/hotels can be expanded however make sure or null is used if you do since this is supposed to be used for multiple functions
interface DisplayRoom {
    id: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    roomType?: string;
    sourceName?: string;
}

// Might need to be used to simplify filtering
// Did use AI to help generate this interface because of its complexity
interface ApiRoom {
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    imageUrl: string;
    source: {
        sourceId: number;
        sourceName: string;
        locationType: string;
        city: string;
        country: string;
    };
    visible: boolean;
}

function SearchPage() {

    // Needs to be destructured to be able to be changed
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Just to store all hotels however not to be changed only used to filter
    const [allRoomsFromApi, setAllRoomsFromApi] = useState<DisplayRoom[]>([]);
    const [filteredDisplayRooms, setFilteredDisplayRooms] = useState<DisplayRoom[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Changed to allow null as well
    const [searchTerm, setSearchTerm] = useState<string | null>(() => searchParams.get('searchTerm') || '');
    const [checkInDate, setCheckInDate] = useState<string | null>(() => parseURLDate(searchParams.get('from')));
    const [checkOutDate, setCheckOutDate] = useState<string | null>(() => parseURLDate(searchParams.get('to')));
    const [roomType, setRoomType] = useState<string>(() => searchParams.get('roomType') || 'any');

    //Only run once to create the main list
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log("SearchPage: Fetching all rooms...");
        //Get all hotels
        axios.get(`http://localhost:8080/api/rooms`)
            .then(response => {
                console.log("Fetched all rooms", response.data);
                setAllRoomsFromApi(response.data.filter((room => room.visible) || []))
            })
            .catch(err => {
                console.log("Failed to Fetch all rooms", err);
                setError("Failed to fetch all rooms.");
                setAllRoomsFromApi([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    //Run to get filtered hotels to display hotelcards
    useEffect(() => {
        console.log("SearchPage: URL params changed or allHotels updated. Filtering...");

        // Update initial values for SearchBar based on current URL
        setSearchTerm(searchParams.get('searchTerm') || '');
        setCheckInDate(parseURLDate(searchParams.get('from')));
        setCheckOutDate(parseURLDate(searchParams.get('to')));
        setRoomType(searchParams.get('roomType') || 'any');

        if (allRoomsFromApi.length === 0 && !error && isLoading) {
            return; // Still waiting for the initial fetch to complete or error out
        }
        if (error) { // If there was an error fetching, show no results and stop loading
            setFilteredDisplayRooms([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const searchTermParam = (searchParams.get('searchTerm') || '').toLowerCase();
        //const fromDateParam = parseURLDate(searchParams.get('from'));
        //const toDateParam = parseURLDate(searchParams.get('to'));
        const roomTypeParam = (searchParams.get('roomType') || 'any').toLowerCase();

        // Got help from AI to finish this filter logic
        // Map ApiRoom to DisplayRoom
        let mappedForDisplay: DisplayRoom[] = allRoomsFromApi.map(apiRoom => ({
            id: String(apiRoom.roomId),
            name: apiRoom.roomName,
            location: apiRoom.source.city,
            description: apiRoom.description,
            imageUrl: apiRoom.imageUrl  || '/images/default-room.jpg',
            roomType: apiRoom.roomType,
            sourceName: apiRoom.source.sourceName,
        }));

        /**
         * Filter by search term
         */
        if (searchTermParam) {
            mappedForDisplay = mappedForDisplay.filter(room =>
                room.name.toLowerCase().includes(searchTermParam) ||
                room.location.toLowerCase().includes(searchTermParam) ||
                (room.sourceName && room.sourceName.toLowerCase().includes(searchTermParam))
            );
        }

        /**
         * Filter by roomType
         */
        if (roomTypeParam && roomTypeParam !== 'any') {
            mappedForDisplay = mappedForDisplay.filter(room =>
                room.roomType?.toLowerCase() === roomTypeParam
            );
        }

        setFilteredDisplayRooms(mappedForDisplay);
        setIsLoading(false);


    }, [searchParams, allRoomsFromApi, isLoading, error]); // Re-run when URL params change OR when allHotels data arrives


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
        navigateToRoomDetails(navigate, hotelId, checkInDate, checkOutDate);
    };

    return (
        <div>
            <Header/>
            <main>
                {/* Search Bar Section temporary until function is made */}
                <section className={SearchPageStyle.container} style={{ marginTop: '20px' }}>
                    <SearchBar
                        onSearch={handleSearchFromBar}
                        initialSearchTerm={searchTerm}
                        initialStartDate={checkInDate}
                        initialEndDate={checkOutDate}
                        initialRoomType={roomType}
                        // className={homePageStyle.customSearchBarOnHomepage} // Optional for homepage specific tweaks
                    >
                        {/* TODO: add filters as children */}
                    </SearchBar>
                </section>

                {/* Filters Section
                <div className="filters">
                    <button className="filter-btn">Sort by (rating, low to high...)</button>
                    <button className="filter-btn">Price</button>
                    <button className="filter-btn">Filter by rooms</button>
                    <button className="filter-btn">Rating</button>
                    <button className="filter-btn">DisplayRoom or house</button>
                </div>
                */}

                {/* DisplayRoom List Section */}
                <div className="hotel-list">
                    {filteredDisplayRooms.length > 0 ? (
                        filteredDisplayRooms.map((room) => (
                                <HotelCard
                                    key={room.id}
                                    id={room.id}
                                    imageUrl={room.imageUrl}
                                    imageAlt={`Image of ${room.name}`}
                                    title={room.name}
                                    description={room.description}
                                >
                                    {/* Using buttons as children was an idea given by AI since i could not figure out how to use different buttons depending on the page while they were still connected */}
                                    <button
                                        className="deal-btn"
                                        onClick={() => {
                                            GoToDealHandler(room.id)
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