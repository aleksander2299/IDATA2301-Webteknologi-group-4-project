import { useEffect, useState } from 'react';
import { axiosInstance } from "../../AxiosInstance.js";
//import PropTypes from 'prop-types';

// Import the specific CSS for this component
import HotelCardStyles from './HotelCard.module.css';

import FavoriteButton from '../../components/FavoriteButton/FavoriteButton.tsx';
import { Room } from '../../types/Room.ts';

const DEFAULT_IMAGE_URL = '/images/placeholder-hotel.png';

interface HotelCardProps {
    id: number; // Only part of the prop that is not optional
    imageUrl?: string;
    imageAlt?: string;
    title?: string;
    description?: string;
    price?: number;
    children?: React.ReactNode,
    onClick?: () => void;
}

function HotelCard({
  id,
  imageUrl,
  imageAlt,
  title,
  description,
  price,
  children,
  onClick,
}: HotelCardProps) {

    const [room, setRoom] = useState<Room >();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if(!token) return;

      async function fetchRoom(roomID: number, token: string) {
        const response = await axiosInstance.get(`/rooms/${roomID}`, {
            headers: { Authorization: `Bearer ${token}` },
            });
        setRoom(response.data);
        }

        fetchRoom(id, token);

    }, [id])
    

    // Error Handling
    const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
    const [hasImageError, setHasImageError] = useState(false);

    // If imageUrl Changes
    useEffect(() => {
        setCurrentImageUrl(imageUrl || DEFAULT_IMAGE_URL);
        setHasImageError(false);
    }, [imageUrl]);

    const handleImageError = () => {
        if (!hasImageError) {
            {/* System to stop a infinite loop if default image does not work either */}
            setCurrentImageUrl(DEFAULT_IMAGE_URL);
            setHasImageError(true);
            }
        }

    return (
        <div className={HotelCardStyles["hotel-card"]} hotel-id={id}    onClick={onClick}>
              <div className={HotelCardStyles["hotel-card-image-container"]}>
                <img
                    src={currentImageUrl}
                    alt={imageAlt}
                    // On Error use placeholder
                    onError={handleImageError}
                />
                <div className={HotelCardStyles.favbuttonoverlay}>
                  {room && <FavoriteButton room={room} />}
                </div>
              </div>

              <div className={HotelCardStyles["hotel-card-info"]}>
                {/* Conditionally render title if provided */}
                {title && <h3 className="hotel-card-title">{title}</h3>}
                {/* Conditionally render description if provided */}
                {description && <p className="hotel-card-description">{description}</p>}
                {/* Conditionally render price if provided */}
                {price && <p className="hotel-card-price">{price}</p>}
              </div>

              {/* Render action buttons passed as children */}
              {children && <div className={HotelCardStyles["hotel-card-actions"]}>{children}</div>}
            </div>
      )
    }


HotelCard.defaultProps = {
  imageUrl: DEFAULT_IMAGE_URL,
  imageAlt: 'Hotel room or property',
  title: '',
  description: '',
  price: undefined,
  children: null,
};

export default HotelCard;