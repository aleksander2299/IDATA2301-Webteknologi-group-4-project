import { useEffect, useState } from 'react';

import '../../styles/main.css';
import adminPageStyle from './AdminPage.module.css';


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



function AdminPage() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [allRooms, setAllRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        setIsLoading(true);
        setError(null);
        axiosInstance.get(`/rooms`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setAllRooms(response.data || []);
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to fetch all rooms.");
            });
    }, [token]);


    const handleToggleVisibility = async (roomToUpdate: Room) => {
        const newVisibility = !roomToUpdate.visible;

        const payload: Room = {
            ...roomToUpdate,
            visible: newVisibility,
        };

        try {
            await axiosInstance.put(`/rooms/${roomToUpdate.roomId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(`Admin: Room ${roomToUpdate.roomId} visibility changed to ${newVisibility}`);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("Failed to change room visibility.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditRoom = async (roomId: number) => {

    }

    const handleDeleteRoom = async (roomId: number) => {
    }


    if (isLoading && allRooms.length === 0) {
        return <div className={adminPageStyle.loadingMessage}>Loading all rooms...</div>;
    }
    if (error) {
        return <div className={adminPageStyle.errorMessage}>Error: {error}</div>;
    }
    return (
        <>
            <Header />
            <main>
            <div className={adminPageStyle.contentWrapper}>
                <div className={adminPageStyle.manageBox}>Choose room to manage: </div>
                <section>
                    <div className={adminPageStyle.listings}>
                        {allRooms.length > 0 ? (
                            allRooms.map((room) => (
                                    <HotelCard
                                        key={room.roomId}
                                        id={room.roomId}
                                        imageUrl={"https://picsum.photos/id/1/200/300"}
                                        imageAlt={"https://picsum.photos/id/1/200/300"}
                                        title={room.roomName}
                                        description={room.description}
                                        onClick={() => {
                                            if(window.confirm("do you want to go to the room's details ?")) {
                                                navigate(`/room/${room.roomId}`)}}}>
                                        {/* Different buttons depending on page */}
                                        <button className={adminPageStyle.cardButtons}
                                                onClick={(e) => {e.stopPropagation(); handleEditRoom(room.roomId)}}>Edit Room</button>
                                        <button className={adminPageStyle.cardButtons}
                                                onClick={(e) => {e.stopPropagation(); handleToggleVisibility(room)}}>{room.visible ? 'Hide Room' : 'Show Room'}</button>
                                        <button className={adminPageStyle.cardButtons}
                                                onClick={(e) => {e.stopPropagation(); handleDeleteRoom(room.roomId)}}>Delete Room</button>
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
                    <button className={adminPageStyle.deletebtn}>
                        Delete all listings
                    </button>
                </section>
            </div>
            </main>
            <Footer />
        </>
    );
}

export default AdminPage;
