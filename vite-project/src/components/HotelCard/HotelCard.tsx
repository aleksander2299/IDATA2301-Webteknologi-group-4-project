import { useState, useEffect } from 'react';
//import PropTypes from 'prop-types';

// Import the specific CSS for this component
import HotelCardStyles from './HotelCard.module.css';

const DEFAULT_IMAGE_URL = '/images/placeholder-hotel.png';

interface HotelCardProps {
    id: string; // Only part of the prop that is not optional
    imageUrl?: string;
    imageAlt?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode,
}

function HotelCard({
  id,
  imageUrl,
  imageAlt,
  title,
  description,
  children,
}: HotelCardProps) {

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
        <div className={HotelCardStyles["hotel-card"]} hotel-id={id}>
              <div className={HotelCardStyles["hotel-card-image-container"]}>
                <img
                    src={currentImageUrl}
                    alt={imageAlt}
                    // On Error use placeholder
                    onError={handleImageError}
                />
              </div>

              <div className={HotelCardStyles["hotel-card-info"]}>
                {/* Conditionally render title if provided */}
                {title && <h3 className="hotel-card-title">{title}</h3>}
                {/* Conditionally render description if provided */}
                {description && <p className="hotel-card-description">{description}</p>}
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
  children: null,
};

export default HotelCard;