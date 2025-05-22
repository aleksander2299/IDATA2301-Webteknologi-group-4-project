import { useEffect, useState } from 'react';

import '../../styles/main.css';
import providerPageStyle from './ProviderPage.module.css';


import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance';
import HotelCard from '../../components/HotelCard/HotelCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';


/**
*  interface of room data 
*/ 
interface Room {
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    visible: boolean;
    imageUrl: string;
}

/**
*  interface of provider data
*/ 
interface provider{
    
    providerId : number;
    providerName : string
}

/**
*  interface of room provider data.
*/ 
interface RoomProvider {
   
    roomProviderId: number;
    roomPrice: number;
    room: Room;
    provider: provider;
}

/**
*  function that creates the page out of data.
*/ 
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


    /**
    *  deletes a single listing from the room provider. 
    */ 
    function deleteListing(roomId: number, providerId: number){
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        
        axiosInstance.delete(`/roomProvider/unlink/${roomId}/${providerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(() => {
                 let updatedListings = rooms.filter(room => room.room.roomId !== roomId)
                setRooms(rooms.filter(room => room.room.roomId != roomId))
            })
        .catch((error) => {
            console.error("couldn't remove listing", error);
        });
    }
    
    

    /**
    *  edits the listing of the proviers room price. so price of the room listed changes.
    */ 
   async function editListing(newRoomProviderId : number, price : number, roomProvider : RoomProvider){
        const input = window.prompt("Enter new price:", "0");

        if (input === null) return; 

        price = Number(input)

        setRoomProviderId(newRoomProviderId);
            const updatedRoomProvider = {
            room: { roomId: roomProvider.room.roomId },
            provider: { providerId: roomProvider.provider.providerId },
            roomPrice: price,
        };
        await axiosInstance.put(`/roomProvider/${newRoomProviderId}`,  updatedRoomProvider,                          
            {
              headers: { Authorization: `Bearer ${token}` }   
            }
          )
        .catch((err) =>
            console.error(err)

        );
        
    }

    /**
    *  deletes all listing from the provider so their room providers are unlinked. 
    */ 
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
      .catch((error) => {
        console.error(error);
      });

      setRooms([])
}

    /**
    *  creates the structure of the page.
    */ 
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
                                            <p className={providerPageStyle.nolistedroom}>No listed rooms found.</p>
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
