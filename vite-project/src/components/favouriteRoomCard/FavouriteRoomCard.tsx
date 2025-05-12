import favRoomCardStyle from './FavouriteRoomCard.module.css'
import '../../styles/main.css';

type FavouriteRoomCardProps = {
    room: {
        roomId: number;
        name: string;
        imageUrl: string;
        description?: string;
    };
};

function FavouriteRoomCard ({ room }: FavouriteRoomCardProps) {
    return (
        <div className={favRoomCardStyle.favourite_card}>
            <img src={room.imageUrl} alt={room.name} />
            <button className="removeFavorite">Remove</button>
        </div>
    );

}


export default FavouriteRoomCard;