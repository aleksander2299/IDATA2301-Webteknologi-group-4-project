import { useState } from "react";
import { Link } from 'react-router-dom';

import favRoomCardStyle from './FavouriteRoomCard.module.css';

import { Room } from '../../types/Room';
import FavoriteButton from "../FavoriteButton/FavoriteButton.tsx";

const token = localStorage.getItem('token');

type FavouriteRoomCardProps = {
    room: Room;
    favouriteId: number;
};

function FavouriteRoomCard ({ room, favouriteId }: FavouriteRoomCardProps) {
    const [disabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Remove");

    return (
        <div className={favRoomCardStyle.favourite_card}>
            <div className={favRoomCardStyle.favcardwrapper}>
                <Link to={`/room/${room.roomId}`}>
            <img src={room.imageUrl} alt={room.roomName} />
            </Link>
            <div className={favRoomCardStyle.favbuttonoverlay}>
                <FavoriteButton room={room} />
            </div>
            <section className={favRoomCardStyle.hotelinfo}>
                <h1>{room.roomName}</h1>
                <p>
                    {room.description}
                </p>
            </section>

            </div>
        </div>
    );

}


export default FavouriteRoomCard;