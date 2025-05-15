import {useState} from "react";

import favRoomCardStyle from './FavouriteRoomCard.module.css'

import roomImg from '../../Images/room image placeholder.jpg';
import { Room } from '../../types/Room';
import {axiosInstance} from "../../AxiosInstance.tsx";

const token = localStorage.getItem('token');

type FavouriteRoomCardProps = {
    room: Room;
    favouriteId: number;
};

function FavouriteRoomCard ({ room, favouriteId }: FavouriteRoomCardProps) {
    const [disabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Remove");

    const handleUnfavourite = async () => {
        try {
            const response = await axiosInstance.delete(`/favourite/${favouriteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 204) {
                setDisabled(true);
                setButtonText("Removed");
            } else {
                // Optional: handle unexpected response
                setButtonText("Error");
            }
        } catch (err) {
            console.error("Failed to delete favourite:", err);
            setButtonText("Error");
        }



    }

    return (
        <div className={favRoomCardStyle.favourite_card}>
            <img src={room.imageUrl} alt={room.roomName} />
            <button className="removeFavourite" onClick={handleUnfavourite} disabled={disabled}>
                {buttonText}
            </button>
        </div>
    );

}


export default FavouriteRoomCard;