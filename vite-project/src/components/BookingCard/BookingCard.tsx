import { useState } from "react";
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance.js';

import bookingCardStyle from './BookingCard.module.css';

import { Booking } from "../../types/Booking.ts";
import { Room } from '../../types/Room';

const token = localStorage.getItem('token');

type BookingCardProps = {
    bookingId: number;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
};

function BookingCard ({ bookingId, room, checkInDate, checkOutDate }: BookingCardProps) {

    const [bookings, setBookings] = useState<Booking[]>([]);

    function cancelBooking(bookingId: number){
    
            axiosInstance.delete(`/booking/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                let updatedBookings = bookings.filter(booking => booking.bookingId !== bookingId)
                setBookings(updatedBookings)
            }
            )
            .catch((err) =>{
                console.error(err)
            })
            
        }

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
                    {/* Conditionally render description if provided, used AI to fix the image links. */}
                    {room.description && (
                        <p>
                            {room.description.split('\n').map((line, i) => (
                                <span key={i}>
                                {line.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                                    if (part.match(/https?:\/\/[^\s]+/)) {
                                        try {
                                            const url = new URL(part);
                                            const shortText = url.hostname.replace(/^www\./, '');
                                            return (
                                                <a
                                                    key={index}
                                                    href={part}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'underline' }}
                                                >
                                                    {shortText}
                                                </a>
                                            );
                                        } catch {
                                            return part;
                                        }
                                    } else {
                                        return <span key={index}>{part}</span>;
                                    }
                                })}
                                <br />
                                </span>
                            ))}
                            </p>
                        )}
                </section>
                <button className={bookingCardStyle.cancelbtn} onClick={() => {cancelBooking(bookingId); alert("Booking cancelled.");}}>Cancel booking</button>

            </div>
        </div>
    );

}


export default BookingCard;