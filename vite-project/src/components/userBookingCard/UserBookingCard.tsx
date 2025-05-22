import userBookingCardStyle from './UserBookingCard.module.css'
import '../../styles/main.css';
import {Room} from '../../types/Room.ts'

import {Link} from "react-router-dom";
import {Booking} from "../../types/Booking.ts";
import {axiosInstance} from "../../AxiosInstance.tsx";
import {useState} from "react";

const token = localStorage.getItem('token');

/**
 * type of userbookingcardprops that has booking and room. 
 */
type UserBookingCardProps = {
    booking: Booking;
    room: Room;
};

/**
 * function that creates a userbookingcard based on booking and room parameters.
 */
function UserBookingCard ({ booking, room }: UserBookingCardProps) {

    const [disabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Cancel");

    const handleCancellation = async () => {
        try {
            const response = await axiosInstance.delete(`/booking/${booking.bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 204) {
                setDisabled(true);
                setButtonText("Cancelled");
            } else {
                // Optional: handle unexpected response
                setButtonText("Error");
            }
        } catch (err) {
            console.error("Failed to cancel booking:", err);
            setButtonText("Error");
        }



    }

    /**
    * creates the user booking card. 
    */
    return (
        <div className={userBookingCardStyle.booking_card}>
            <Link to={`/room/${room.roomId}`}>
                <img src={room.imageUrl} alt={room.roomName} />
            </Link>
            <p className="roomName">{room.roomName}</p>
            <p className="startTime">Start: {booking.checkInDate}</p>
            <p className="endTime">End: {booking.checkOutDate}</p>
            <button className="cancelButton" onClick={handleCancellation} disabled={disabled}>{buttonText}</button>
        </div>
    );

}


export default UserBookingCard;