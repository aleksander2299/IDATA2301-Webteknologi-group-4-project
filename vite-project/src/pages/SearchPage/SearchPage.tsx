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
    lowestPrice?: number;
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

interface ApiRoomProviderForRoom { // Data from /api/rooms/{id}/roomProviders
    roomProviderId: number;
    roomPrice: number;
    provider: {
        providerId: number;
        providerName: string;
    };
}

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'default';

function SearchPage() {

    // Needs to be destructured to be able to be changed
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Just to store all hotels however not to be changed only used to filter
    const [allRoomsFromApi, setAllRoomsFromApi] = useState<ApiRoom[]>([]);
    const [roomsWithPrices, setRoomsWithPrices] = useState<DisplayRoom[]>([]);
    const [filteredDisplayRooms, setFilteredDisplayRooms] = useState<DisplayRoom[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Changed to allow null as well
    const [searchTerm, setSearchTerm] = useState<string | null>(() => searchParams.get('searchTerm') || '');
    const [checkInDate, setCheckInDate] = useState<string | null>(() => parseURLDate(searchParams.get('from')));
    const [checkOutDate, setCheckOutDate] = useState<string | null>(() => parseURLDate(searchParams.get('to')));
    const [roomType, setRoomType] = useState<string>(() => searchParams.get('roomType') || 'any');
    const [sortOption, setSortOption] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'default');


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
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (allRoomsFromApi.length === 0) {
            if (!isLoading && !error) setIsLoading(false);
            setRoomsWithPrices([]); // Ensure it's empty
            return;
        }

        console.log("SearchPage: Processing rooms to fetch providers and prices...");
        setIsLoading(true); // Loading while fetching providers for all rooms

        const fetchProvidersForAllRooms = async () => {
            const roomsProcessed: DisplayRoom[] = [];
            for (const apiRoom of allRoomsFromApi) {
                try {
                    const response = await axios.get<ApiRoomProviderForRoom[]>(`http://localhost:8080/api/rooms/${apiRoom.roomId}/roomProviders`);
                    const providers = response.data || [];

                    if (providers.length > 0) {
                        const prices = providers.map(p => p.roomPrice).filter(price => typeof price === 'number');
                        if (prices.length > 0) {
                            roomsProcessed.push({
                                id: String(apiRoom.roomId),
                                name: apiRoom.roomName,
                                location: apiRoom.source.city || apiRoom.source.sourceName,
                                description: apiRoom.description,
                                imageUrl: apiRoom.imageUrl || '/images/default-room.jpg',
                                roomType: apiRoom.roomType,
                                sourceName: apiRoom.source.sourceName,
                                lowestPrice: Math.min(...prices),
                            });
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch providers for room ${apiRoom.roomId}:`, err);
                }
            }
            return roomsProcessed;
        };

        fetchProvidersForAllRooms()
            .then(processedRooms => {
                setRoomsWithPrices(processedRooms);
            })
            .catch(overallError => {
                console.error("Error during provider fetching process:", overallError);
                setError("Could not load all room price information.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [allRoomsFromApi]);

    //Run to get filtered hotels to display hotelcards
    useEffect(() => {
        console.log("SearchPage: URL params changed or allHotels updated. Filtering...");

        // Update initial values for SearchBar based on current URL
        setSearchTerm(searchParams.get('searchTerm') || '');
        setCheckInDate(parseURLDate(searchParams.get('from')));
        setCheckOutDate(parseURLDate(searchParams.get('to')));
        setRoomType(searchParams.get('roomType') || 'any');
        setSortOption((searchParams.get('sort') as SortOption) || 'default');

        if (isLoading) { // If primary data fetching (effects 1 & 2) is ongoing
            console.log("Still loading primary data, skipping filtering.");
            setFilteredDisplayRooms([]);
            return;
        }

        if (error) { // If there was an error fetching, show no results and stop loading
            console.log("Error present, setting empty filtered display rooms.");
            setFilteredDisplayRooms([]);
            return;
        }
        if (roomsWithPrices.length === 0 && !error && isLoading) {
            console.log("No rooms with prices to filter. Setting empty filtered display rooms.");
            setFilteredDisplayRooms([]);
            return; // Still waiting for the initial fetch to complete or error out
        }

        console.log("Proceeding with filtering. roomsWithPrices:", roomsWithPrices);

        const searchTermParam = (searchParams.get('searchTerm') || '').toLowerCase();
        const roomTypeParam = (searchParams.get('roomType') || 'any').toLowerCase();

        let filteredRooms = [...roomsWithPrices]

        /**
         * Filter by search term
         */
        if (searchTermParam) {
            filteredRooms = filteredRooms.filter(room =>
                room.name.toLowerCase().includes(searchTermParam) ||
                room.location.toLowerCase().includes(searchTermParam) ||
                (room.sourceName && room.sourceName.toLowerCase().includes(searchTermParam))
            );
        }

        /**
         * Filter by roomType
         */
        if (roomTypeParam && roomTypeParam !== 'any') {
            filteredRooms = filteredRooms.filter(room =>
                room.roomType?.toLowerCase() === roomTypeParam
            );
        }

        /**
         * Sorting by sortOption
         */
        const currentSortOption = sortOption;
        switch (currentSortOption) {
            case 'price_asc':
                filteredRooms.sort((a, b) => (a.lowestPrice) - (b.lowestPrice));
                break;
            case 'price_desc':
                filteredRooms.sort((a, b) => (b.lowestPrice) - (a.lowestPrice));
                break;
            case 'name_asc':
                filteredRooms.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                filteredRooms.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        setFilteredDisplayRooms(filteredRooms);
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
                        {/* TODO: Add functioning class */}
                        <label htmlFor="sortOptions" style={{display: 'block', marginBottom: '5px', fontSize: '0.9em'}}>Sort By:</label>
                        <select
                            id="sortOptions"
                            value={sortOption}
                            //onChange={() => handleExtraFilterChange()}
                        >
                            <option value="default">Relevance</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name_asc">Name: A-Z</option>
                            <option value="name_desc">Name: Z-A</option>
                        </select>
                    </SearchBar>
                </section>

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
                                    price={room.lowestPrice}
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