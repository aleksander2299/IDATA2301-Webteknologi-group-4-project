import { useEffect, useState } from "react";
import { axiosInstance } from '../../AxiosInstance.js';

import '../../styles/main.css';
import bookingPageStyle from './BookingPage.module.css';

import bookingCard from "../../components/BookingCard/bookingCard.tsx";
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import { Booking } from "../../types/Booking.ts";

function BookingPage () {

    //const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function fetchFavourites() {
            try {
                const response = await axiosInstance.get(`/favourite/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                //setFavourites(response.data);
            } catch (err) {
                console.log(err);
                console.log("username here: " + username);
            } finally {
                setLoading(false);
            }
        }
        fetchFavourites();
    }, [username]);

    return (
        <div className={bookingPageStyle.favourites}>
            <Header />

            <main className={bookingPageStyle.content}>
                <div className={bookingPageStyle.topbox}>
                    <h1>Favourite rooms:</h1>
                </div>
                <section id={bookingPageStyle.favourites_container}>
                    {loading && <p>Loading...</p>}
                    {!loading && favourites.length === 0 && <p className={bookingPageStyle.nofavroom}>No favourite rooms found.</p>}
                    {favourites.map((favourite) => (
                        <bookingCard

                        />
                    ))}
                </section>
            </main>

            <Footer/>
        </div>
    );

}




export default BookingPage;