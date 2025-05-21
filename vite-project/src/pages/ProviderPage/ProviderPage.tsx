import { useEffect, useState } from 'react';

import '../../styles/main.css';
import providerPageStyle from './ProviderPage.module.css';


import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance';
import HotelCard from '../../components/HotelCard/HotelCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';



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
    provider: provider;
}


function ProviderPage() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");


    {/* Fake Temporary data its set up differently since it will display every hotelcard it gets, so its not every hotel */}
        const [rooms, setRooms] = useState<RoomProvider[]>([]);
        const currentProvider = useState()
        const navigate = useNavigate();
        const [roomProviderId, setRoomProviderId] = useState<number>();
        const [changeSite, setChangeSite] = useState<number>();



    useEffect(() => {
        axiosInstance.get(`/providers/${username}/roomProviders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then((response) => {
            setRooms(response.data);
            console.log(JSON.stringify(response.data));
            setChangeSite(0);
        })
        .catch((error) => {<q></q>
            console.error(error);
        });
    },[changeSite]);


    function deleteListing(roomId: number, providerId: number){
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        
        axiosInstance.delete(`/roomProvider/unlink/${roomId}/${providerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(() => {
            console.log("successfully removed listing");
            axiosInstance.get(`/providers/${username}/roomProviders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    
                }
                
            })
            .then((response) => {
                setChangeSite(1);
                setRooms(response.data);
            })
            
        })
        .catch((error) => {
            console.error("couldn't remove listing", error);
        });
    }
    
    


   async function editListing(newRoomProviderId : number, price : number, roomProvider : RoomProvider){
        const input = window.prompt("Enter new price:", price.toString());

        if (input === null) return; 

        price = Number(input)

        setRoomProviderId(newRoomProviderId);
            const updatedRoomProvider = {
            ...roomProvider,
            roomPrice: price,
        };

        await axiosInstance.put(`/roomProvider/${newRoomProviderId}`,  updatedRoomProvider,                          
            {
              headers: { Authorization: `Bearer ${token}` }   
            }
          ).then((response) =>
            console.log(JSON.stringify(response.data) + " It worked ???")
        )
        .catch((err) =>
            console.error(err)

        );
        
    }

    async function deleteAllListings(){
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        for (const roomProvider of rooms) {
            await axiosInstance.delete(`/roomProvider/unlink/${roomProvider.room.roomId}/${roomProvider.provider.providerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }
    await axiosInstance.get(`/providers/${username}/roomProviders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRooms([])
      })
      .catch((error) => {
        console.error(error);
      });
}


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
                                                        onClick={(e) => {e.stopPropagation(); editListing(Rp.roomProviderId,Rp.roomPrice,Rp)}}>Edit price</button>
                                                        <button className={providerPageStyle.cardButtons} onClick={(e) => {e.stopPropagation(); 
                                                        deleteListing(Rp.room.roomId, Rp.provider.providerId);}}>Delete listing</button> 
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
                    <button className={providerPageStyle.deletebtn} onClick={deleteAllListings}>
                        Delete all listings
                    </button>
                </section>
            </div>

            <Footer />
        </>
    );
}

export default ProviderPage;
