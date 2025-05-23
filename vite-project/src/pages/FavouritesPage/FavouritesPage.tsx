import { useEffect, useState } from "react";
import { axiosInstance } from '../../AxiosInstance.js';

import '../../styles/main.css';
import favPageStyles from './FavouritesPage.module.css';

import FavouriteRoomCard from "../../components/favouriteRoomCard/FavouriteRoomCard";
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import { Favourite } from "../../types/Favourite.ts";

/**
*  creates favourite page out of data 
*/ 
function FavouritesPage () {

    const [favourites, setFavourites] = useState<Favourite[]>([]);
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

/**
*  creates the structure of the page 
*/ 
    return (
        <div>
            <Header />

            <main className={favPageStyles.content}>
                <div className={favPageStyles.topbox}>
                    <h1>Favourite rooms:</h1>
                </div>
                <section id={favPageStyles.favourites_container}>
                    {loading && <p>Loading...</p>}
                    {!loading && favourites.length === 0 && <p className={favPageStyles.nofavroom}>No favourite rooms found.</p>}
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