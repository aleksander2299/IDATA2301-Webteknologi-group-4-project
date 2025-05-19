import { useEffect, useState } from 'react';

import '../../styles/main.css';
import providerPageStyle from './ProviderPage.module.css';


import { axiosInstance } from '../../AxiosInstance';
import HotelCard from '../../components/HotelCard/HotelCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';


const token = localStorage.getItem("token");

interface Room {
    id: number;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
}

interface provider{
    
    providerId : number;
    providerName : string
}

interface RoomProvider {
    roomProviderId: number;
    roomPrice: number;
    provider: {
      providerId: number;
      providerName: string;
    };
  }
  

function ProviderPage() {

    {/* Fake Temporary data its set up differently since it will display every hotelcard it gets, so its not every hotel */}
        const [rooms, setRooms] = useState<Room[]>([]);
        const currentProvider = useState()




    useEffect(() => {
        axiosInstance.get(`/providers/AirbnbStays/roomProviders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then((response) => {
            setRooms(response.data);
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.error(error);
        });
    }, [rooms.length]);


    return (
        <>
            <Header />
            <div className={providerPageStyle.contentWrapper}>
                <div className={providerPageStyle.manageBox}>Choose room or listing to manage: </div>
                <section>
                    <div className={providerPageStyle.listings}>
                                        {rooms.length > 0 ? (
                                            rooms.map((Room) => (
                                                    <HotelCard
                                                        key={Room.id}
                                                        id={Room.id}
                                                        imageUrl={"https://picsum.photos/id/1/200/300"}
                                                        imageAlt={"https://picsum.photos/id/1/200/300"}
                                                        title={Room.name}
                                                        description={Room.description}
                                                    >
                                                        {/* Different buttons depending on page */}
                                                        <button className={providerPageStyle.cardButtons}>Edit listing</button>
                                                        <button className={providerPageStyle.cardButtons}>Delete listing</button>
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
                    <button className={providerPageStyle.deletebtn}>
                        Delete all listings
                    </button>
                </section>
            </div>

            <Footer />
        </>
    );
}

export default ProviderPage;
