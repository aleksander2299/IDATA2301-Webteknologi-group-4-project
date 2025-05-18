import { useEffect, useState } from "react";
import { axiosInstance } from "../../AxiosInstance.js";

import favoriteButtonStyle from './FavoriteButton.module.css';

import EmptyHeartIcon from '../../assets/emptyHeart.svg?react';
import FilledHeartIcon from '../../assets/filledHeart.svg?react';

import { Favourite } from "../../types/Favourite.js";

interface FavoriteButtonProps {
    roomId: number;
}

function FavoriteButton({ roomId }: FavoriteButtonProps) {

    const [isFavorited, setIsFavorited] = useState(false);

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    async function fetchUserFavorites(username: string, token: string) {
    const response = await axiosInstance.get(`/favourite/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
    return response.data;
    }

    async function addFavorite(favorite:Favourite, token: string) {
        await axiosInstance.post('/favourite', {favorite}, {headers: {Authorization: `Bearer ${token}` }});
    }

    async function removeFavorite(username: string, roomId: number, token: string) {
        await axiosInstance.delete(`/favourite/user/${username}/room/${roomId}`, {
                                    headers: { Authorization: `Bearer ${token}` },});
    }

    useEffect(() => {
        if(!username || !token) return;
        
        async function checkIfFavorited() {
            try{
                const favorites = await fetchUserFavorites(username, token);
                const roomIsFavorited = favorites.some((fav: { room: { roomId: number } }) => fav.room.roomId === roomId);
                setIsFavorited(roomIsFavorited);

            } catch(error) {
            console.error("Could not retrieve favorite status from user.", error);
            }

        }

        checkIfFavorited();

        

    }, [roomId, username, token]);
    
    const toggleFavorite = async () => {
        if(!username || !token) return;

        try {
            if(isFavorited) {
                await removeFavorite(username, roomId, token);
                setIsFavorited(false);
            } else {
                await addFavorite(roomId, token);
                setIsFavorited(true);
            }

        } catch(error) {
            console.error('Could not toggle favorite', error);
        }
    };

    return (
        <>
        <div className={favoriteButtonStyle.buttonContainer}>
            <button
            className="favoritebutton"
            onClick={toggleFavorite}
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