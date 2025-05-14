import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from '../../AxiosInstance.js';

import favPageStyles from './FavouritesPage.module.css';
import '../../styles/main.css';

import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import FavouriteRoomCard from "../../components/favouriteRoomCard/FavouriteRoomCard";

function FavouritesPage () {

    const [rooms, setRooms] = useState([]);
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
                setRooms(response.data);
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
        <div className={favPageStyles.favourites}>
            <Header />

            <main className={favPageStyles.content}>
                <h1>Favorite rooms</h1>
                <section id={favPageStyles.favourites_container}>
                    {loading && <p>Loading...</p>}
                    {!loading && rooms.length === 0 && <p>No favourite rooms found.</p>}
                    {!loading && rooms.map((room) => (
                        <FavouriteRoomCard key={room.roomId} room={room} />
                    ))}
                </section>
            </main>

            <Footer/>
        </div>
    );

}

    


export default FavouritesPage;