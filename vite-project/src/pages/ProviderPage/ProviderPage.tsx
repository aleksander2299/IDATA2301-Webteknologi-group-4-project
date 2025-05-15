import { useState } from 'react';

import '../../styles/main.css';
import providerPageStyle from './ProviderPage.module.css';


import HotelCard from '../../components/HotelCard/HotelCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

interface Hotel {
    id: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
}

function ProviderPage() {

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
            {
                id: '3', name: 'Hotel 3', location: 'Location 2',
                description: 'This hotel has a nice  oceanside view', imageUrl: '/images/hotel-room-2.jpg'
            },
            {
                id: '4', name: 'Hotel 4', location: 'Location 2',
                description: 'This hotel has a nice  oceanside view', imageUrl: '/images/hotel-room-2.jpg'
            },
            {
                id: '5', name: 'Hotel 5', location: 'Location 2',
                description: 'This hotel has a nice  oceanside view', imageUrl: '/images/hotel-room-2.jpg'
            },
            
        ]);
    

    return (
        <>
            <Header />
            <div className={providerPageStyle.contentWrapper}>
                <div className={providerPageStyle.manageBox}>Choose room to manage: </div>
                <section>
                    <div className={providerPageStyle.listings}>
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
                </section>
                <section>
                    {/* Searchbar for adding a room */}
                    {/* List of all rooms searched for */}
                </section>
            </div>

            <Footer />
        </>
    );
}

export default ProviderPage;
