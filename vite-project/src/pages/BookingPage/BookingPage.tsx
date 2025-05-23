import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance.js';

import '../../styles/main.css';
import bookingPageStyle from './BookingPage.module.css';


import BookingCard from "../../components/BookingCard/BookingCard.tsx";
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import { Booking } from "../../types/Booking.ts";

/**
*  function that creates the booking page based on data 
*/ 
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

/**
*  creates the structure of the page 
*/     
    return (
        <div>
            <Header />
            <main className={bookingPageStyle.content}>
                <div className={bookingPageStyle.topbox}>
                    <h1>Booked stays:</h1>
                </div>
                <section className={bookingPageStyle.bookingcontainer}>
                    {loading && <p>Loading...</p>}
                    {!loading && bookings.length === 0 && <p className={bookingPageStyle.nobooking}>No booking found.</p>}
                    {bookings.map((booking) => (
                        <div>
                        <BookingCard
                            key={booking.bookingId}
                            bookingId={booking.bookingId}
                            room={booking.roomProvider.room}
                            checkInDate={booking.checkInDate}
                            checkOutDate={booking.checkOutDate}
                            />
                        </div>
                    ))}
                </section>
            </main>

            <Footer/>
        </div>
    );

}




export default BookingPage;