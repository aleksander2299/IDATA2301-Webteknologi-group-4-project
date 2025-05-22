import { useState } from "react";
import { Link } from 'react-router-dom';

import favRoomCardStyle from './FavouriteRoomCard.module.css';

import { Room } from '../../types/Room';
import FavoriteButton from "../FavouriteButton/FavouriteButton.tsx";

const token = localStorage.getItem('token');

type FavouriteRoomCardProps = {
    room: Room;
    favouriteId: number;
};

function FavouriteRoomCard ({ room, favouriteId }: FavouriteRoomCardProps) {
    const [disabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Remove");

    return (
        <div className={favRoomCardStyle.favourite_card}>
            <div className={favRoomCardStyle.favcardwrapper}>
                <Link to={`/room/${room.roomId}`}>
                    <img src={room.imageUrl} alt={room.roomName} />
                </Link>
            <div className={favRoomCardStyle.favbuttonoverlay}>
                <FavoriteButton room={room} />
            </div>
            <section className={favRoomCardStyle.hotelinfo}>
                <h1>{room.roomName}</h1>
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

            </div>
        </div>
    );

}


export default FavouriteRoomCard;