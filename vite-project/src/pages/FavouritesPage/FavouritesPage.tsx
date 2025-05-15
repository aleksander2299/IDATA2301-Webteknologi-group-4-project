import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from '../../AxiosInstance.js';

import favPageStyles from './FavouritesPage.module.css';
import '../../styles/main.css';

import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import FavouriteRoomCard from "../../components/favouriteRoomCard/FavouriteRoomCard"
import { Room } from '../../types/Room';
import { User } from '../../types/User';

function FavouritesPage () {

    const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    type Favourite = {
        favouriteId: number;
        room: Room;
        user: User; // or you can make this more specific if needed later
    };

    useEffect(() => {
        async function fetchFavourites() {
            try {
                const response = await axiosInstance.get(`/favourite/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFavourites(response.data);
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
                    {!loading && favourites.length === 0 && <p>No favourite rooms found.</p>}
                    {favourites.map((favourite) => (
                        <FavouriteRoomCard
                            key={favourite.favouriteId}
                            room={favourite.room}
                            favouriteId={favourite.favouriteId}
                        />
                    ))}
                </section>
            </main>

            <Footer/>
        </div>
    );

}

    


export default FavouritesPage;