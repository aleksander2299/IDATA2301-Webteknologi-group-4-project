import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './SearchPage.css';
import HotelCard from "../../components/HotelCard/HotelCard.jsx"

function SearchPage() {
    {/* Fake Temporary data */}
    const [hotels, setHotels] = useState([
        { id: '1', name: 'Hotel 1', location: 'Location 1', description: 'This hotel has a nice view', imageUrl: '/images/hotel-room-1.jpg' },
        { id: '2', name: 'Hotel 2', location: 'Location 2', description: 'This hotel has a nice  oceanside view', imageUrl: '/images/hotel-room-2.jpg' },
      ]);
    {/* Temporary until we swap to the Api date picker */}
    const [dateFrom, setDateFrom] = useState('2024-08-01');
    const [dateTo, setDateTo] = useState('2024-08-10');

    const navigate = useNavigate();
    function GoToDeal(id, dateFrom, dateTo) {
        {/* Depending on how data is gotten and handled fromDate and toDate might need to be formatted before being put in the url */}
        let url = `/room/${id}?from=${fromDate}&to=${toDate}`;
        navigate(url);
    }
  return (
    <main>
      {/* Search Bar Section temporary until function is made */}
      <section className="container search-section" style={{ marginTop: '20px' }}>
        <div className="searchbarbox">
          <form className="search-field">
            <label htmlFor="SearchLocation">Search for hotel/location</label>
            <input type="search" name="SearchLocation" id="SearchLocation" />
          </form>

          {/* Select dropdown for Room Type */}
          <div className="select-wrapper">
            <label htmlFor="roomType">Room Type</label>
            <select id="roomType" className="search-select"> {/* Use a different class than search-btn */}
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="family">Family</option>
            </select>
          </div>

          {/* Input for Number of Rooms */}
          <form className="numberOfRooms">
            <label htmlFor="number">Number of rooms</label>
            <input type="number" name="number" id="number" min="1" />
          </form>

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
                         onClick={() => GoToDeal(hotel.id,dateFrom,dateTo)}
                         >
                            Go to Deal
                         </button>
                              {/* Different buttons depending on page */}
                </HotelCard>
                )
            )
        ) : (
                  // If empty
                  <p className="no-results-message">No hotels found matching your criteria.</p>
                  )
        }
      </div>
    </main>
  );
}

export default SearchPage;