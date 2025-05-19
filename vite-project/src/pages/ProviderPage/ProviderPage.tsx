import { useEffect, useState } from 'react';

import '../../styles/main.css';
import providerPageStyle from './ProviderPage.module.css';


import HotelCard from '../../components/HotelCard/HotelCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import { axiosInstance } from '../../AxiosInstance';
import roomImg from "../../Images"
import { useNavigate } from 'react-router-dom';



interface Room {
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    visible: boolean;
    imageUrl: string;
}

interface provider{
    
    providerId : number;
    providerName : string
}

interface RoomProvider {
    roomProviderId: number;
    roomPrice: number;
    room: Room;  
    provider: {
      providerId: number;
      providerName: string;
    };
  }
  

function ProviderPage() {
    const token = localStorage.getItem("token");


    {/* Fake Temporary data its set up differently since it will display every hotelcard it gets, so its not every hotel */}
        const [rooms, setRooms] = useState<RoomProvider[]>([]);
        const currentProvider = useState()
        const navigate = useNavigate();



    function deleteListing(){
        
    }


    function editListing(){

    }

    function deleteAllListings(){

    }


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
    },[]);


    return (
        <>
            <Header />
            <div className={providerPageStyle.contentWrapper}>
                <div className={providerPageStyle.manageBox}>Choose room to manage: </div>
                <section>
                    <div className={providerPageStyle.listings}>
                                        {rooms.length > 0 ? (
                                            rooms.map((Rp) => (
                                                    <HotelCard
                                                        key={Rp.room.roomId}
                                                        id={Rp.room.roomId}
                                                        imageUrl={"https://picsum.photos/id/1/200/300"}
                                                        imageAlt={"https://picsum.photos/id/1/200/300"}
                                                        title={Rp.room.roomName}
                                                        description={Rp.room.description}
                                                        onClick={() => {
                                                            if(window.confirm("do you want to go to the room's details ?")) {
                                                            navigate(`/room/${Rp.room.roomId}`)}}}>
                                                        {/* Different buttons depending on page */}
                                                        <button className={providerPageStyle.cardButtons} 
                                                        onClick={(e) => {e.stopPropagation()}}>Edit listing</button>
                                                        <button className={providerPageStyle.cardButtons} onClick={(e) => {e.stopPropagation()}}>Delete listing</button>
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
