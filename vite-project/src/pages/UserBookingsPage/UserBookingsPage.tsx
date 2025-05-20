import '../../styles/main.css';
import userBookingsPageStyle from './UserBookingsPage.module.css';

import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import {useEffect, useState} from "react";
import {axiosInstance} from "../../AxiosInstance.tsx";
import UserBookingCard from "../../components/userBookingCard/UserBookingCard.tsx";
import {Booking} from "../../types/Booking.ts";
import favPageStyles from "../FavouritesPage/FavouritesPage.module.css";
import userBookingsPageStyles from "../UserBookingsPage/UserBookingsPage.module.css";
import FavouriteRoomCard from "../../components/favouriteRoomCard/FavouriteRoomCard.tsx";

function UserBookingsPage () {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await axiosInstance.get(`/booking/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBookings(response.data);
            } catch (err) {
                console.log(err);
                console.log("username here: " + username);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, [username]);

    return (
        <div>
            <Header />
            <main className="content">
                <h1>Booked rooms</h1>
                <section id={userBookingsPageStyles.bookingList}>
                    {loading && <p>Loading...</p>}
                    {!loading && bookings.length === 0 && <p>No booked rooms found.</p>}
                    {bookings.map((booking) => (
                        <UserBookingCard
                            key={booking.bookingId}
                            booking={booking}
                            room={booking.roomProvider.room}
                        />
                    ))}
                </section>
            </main>
            <Footer />
        </div>
        );
    }
export default UserBookingsPage;