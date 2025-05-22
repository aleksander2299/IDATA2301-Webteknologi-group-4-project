import { useState } from "react";
import { Link } from 'react-router-dom';

import bookingCardStyle from './BookingCard.module.css';

import { Room } from '../../types/Room';

const token = localStorage.getItem('token');

type BookingCardProps = {
    bookingId: number;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
};

function BookingCard ({ bookingId, room, checkInDate, checkOutDate }: BookingCardProps) {

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className={bookingCardStyle.favourite_card}>
            <div className={bookingCardStyle.favcardwrapper}>
                <Link to={`/room/${room.roomId}`}>
                    <img src={room.imageUrl} alt={room.roomName} />
                </Link>
                <section className={bookingCardStyle.hotelinfo}>
                    <h1>{room.roomName}</h1>
                    <p className={bookingCardStyle.dates}>
                        <strong>Check-in:</strong> {formatDate(checkInDate)}
                    </p>
                    <p className={bookingCardStyle.dates}>
                        <strong>Check-out:</strong> {formatDate(checkOutDate)}
                    </p>
                    <p>
                        {room.description}
                    </p>
                </section>
                {/* TODO: ADD Cancel if we have time */}

            </div>
        </div>
    );

}


export default BookingCard;