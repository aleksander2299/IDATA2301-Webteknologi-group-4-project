import { useEffect, useState } from "react";
import { axiosInstance } from '../../AxiosInstance.js';
import { useNavigate, useParams } from 'react-router-dom';

import '../../styles/main.css';
import bookingPageStyle from './BookingPage.module.css';


import BookingCard from "../../components/BookingCard/BookingCard.tsx";
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import { Booking } from "../../types/Booking.ts";
import axios from "axios";

function BookingPage () {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!username || !token) { // Added check for token existence
            setLoading(false);
            useNavigate('/login');
        }
        async function fetchBookings() {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/booking/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBookings(response.data || []);
            } catch (err) {
                console.log("Error username here: " + username);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, [username]);

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

    return (
        <div className={bookingPageStyle.favourites}>
            <Header />

            <main className={bookingPageStyle.content}>
                <div className={bookingPageStyle.topbox}>
                    <h1>Bookings</h1>
                </div>
                <section id={bookingPageStyle.favourites_container}>
                    {loading && <p>Loading...</p>}
                    {!loading && bookings.length === 0 && <p className={bookingPageStyle.nofavroom}>No favourite rooms found.</p>}
                    {bookings.map((booking) => (
                        <div>
                        <BookingCard
                            key={booking.bookingId}
                            bookingId={booking.bookingId}
                            room={booking.roomProvider.room}
                            checkInDate={booking.checkInDate}
                            checkOutDate={booking.checkOutDate}
                            
                            />
                        <button onClick={() => cancelBooking(booking.bookingId)}>Cancel booking</button>
                        </div>
                    ))}
                </section>
            </main>

            <Footer/>
        </div>
    );

}




export default BookingPage;