import { useEffect, useState } from "react";
import { axiosInstance } from "../../AxiosInstance.js";

import favoriteButtonStyle from './FavouriteButton.module.css';

import EmptyHeartIcon from '../../assets/emptyHeart.svg?react';
import FilledHeartIcon from '../../assets/filledHeart.svg?react';

import { Room } from "../../types/Room.js";

interface FavoriteButtonProps {
    room: Room;
}

function FavoriteButton({ room }: FavoriteButtonProps) {

    const [isFavorited, setIsFavorited] = useState(false);

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    async function fetchUserFavorites(username: string, token: string) {
        try{
            const response = await axiosInstance.get(`/favourite/user/${username}`, {
                                                    headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch(error: any) {
            if(error.response?.status == 404) {
                return[];
            }
            console.error("Could not fetch favorites", error);
            return [];

        }
    
    }

    async function addFavorite(roomId: number, username: string, token: string) {
        await axiosInstance.post('/favourite/withIds', {favouriteId:null, roomId, username}, {headers: {Authorization: `Bearer ${token}` }});
    }

    async function removeFavorite(roomId: number, username: string, token: string) {
        await axiosInstance.delete('/favourite/withIds', {headers: { Authorization: `Bearer ${token}` },  data: { favouriteId: null, roomId, username }});
    }

    useEffect(() => {
        if (!username || !token || role !== "ROLE_USER") return;
        
        async function checkIfFavorited() {
            try{
                const favorites = await fetchUserFavorites(username, token);
                const roomIsFavorited = favorites.some((fav: { room: { roomId: number } }) => fav.room.roomId === room.roomId);
                setIsFavorited(roomIsFavorited);

            } catch(error) {
            console.error("Could not retrieve favorite status from user.", error);
            }

        }

        checkIfFavorited();

        

    }, [room.roomId, username, token]);
    
    const toggleFavorite = async () => {
        if(!username || !token) return;

        try {
            if(isFavorited) {
                await removeFavorite(room.roomId, username, token);;
                setIsFavorited(false);
            } else {
                await addFavorite(room.roomId, username, token);
                setIsFavorited(true);
            }

        } catch(error) {
            console.error('Could not toggle favorite', error);
        }
    };

    if(role != "ROLE_USER") {
        return null;
    }


    return (
        <>
        <div className={favoriteButtonStyle.buttonContainer}>
            <button
            className="favoritebutton"
            onClick={toggleFavorite}
            aria-label="Favorite Button"
            style={{ background: 'transparent', border: 'none' }}
            >
                {/* Conditionally render SVGs based on dropdown state */}
                {isFavorited ? (
                <FilledHeartIcon width="40" height="40" />
                ) : (
                <EmptyHeartIcon width="40" height="40" />
                )}
            </button>
        </div>
        </>
    );
}

export default FavoriteButton;