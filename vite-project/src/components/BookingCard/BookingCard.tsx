import { useState } from "react";
import { Link } from 'react-router-dom';

import favRoomCardStyle from './bookingCard.module.css';

import { Room } from '../../types/Room';

const token = localStorage.getItem('token');

type FavouriteRoomCardProps = {
    bookingId: number;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
};

function FavouriteRoomCard ({ bookingId, room, checkInDate, checkOutDate }: BookingCardProps) {
    const [disabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Remove");

    return (
        <div className={favRoomCardStyle.favourite_card}>
            <div className={favRoomCardStyle.favcardwrapper}>
                <Link to={`/room/${room.roomId}`}>
                    <img src={room.imageUrl} alt={room.roomName} />
                </Link>
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


export default BookingCard;