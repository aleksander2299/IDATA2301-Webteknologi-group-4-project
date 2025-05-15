import userBookingCardStyle from './UserBookingCard.module.css'
import '../../styles/main.css';
import {Room} from '../../types/Room.ts'

import roomImg from '../../Images/room image placeholder.jpg';

type UserBookingCardProps = {
    bookingId: number;
    room: Room;
};

function UserBookingCard ({ bookingId, room }: UserBookingCardProps) {
    return (
        <div className={userBookingCardStyle.favourite_card}>
            <img src={room.imageUrl} alt={room.roomName} />
            <button className="removeFavorite">Remove</button>
        </div>
    );

}


export default UserBookingCard;